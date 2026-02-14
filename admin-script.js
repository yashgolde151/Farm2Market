// Admin Database Management System
class AdminDatabase {
    constructor() {
        this.users = this.loadUsers();
        this.documents = this.loadDocuments();
        this.currentDocument = null;
        this.init();
    }

    init() {
        this.checkLogin();
        this.loadServerData();
        this.updateStats();
        this.renderUsers();
        this.renderFarmers();
        this.renderBuyers();
        this.renderDocuments();
        this.startPolling();
    }

    // Load data from server
    async loadServerData() {
        try {
            const [usersResponse, docsResponse] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/documents')
            ]);

            if (usersResponse.ok) {
                this.users = await usersResponse.json();
            }

            if (docsResponse.ok) {
                this.documents = await docsResponse.json();
            }

            console.log('Loaded from server:', this.users.length, 'users,', this.documents.length, 'documents');
        } catch (error) {
            console.log('Server not available, using local storage');
            // Fallback to localStorage
            this.users = this.loadUsers();
            this.documents = this.loadDocuments();
        }
    }

    checkLogin() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            document.getElementById('adminPanel').style.display = 'none';
            document.getElementById('loginCheck').style.display = 'block';
            return false;
        }
        return true;
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('farm2market_users');
        return users ? JSON.parse(users) : [];
    }

    // Load documents from localStorage
    loadDocuments() {
        const docs = localStorage.getItem('farm2market_documents');
        return docs ? JSON.parse(docs) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('farm2market_users', JSON.stringify(this.users));
    }

    // Save documents to localStorage
    saveDocuments() {
        localStorage.setItem('farm2market_documents', JSON.stringify(this.documents));
    }

    // Add new user to database
    addUser(userData) {
        const user = {
            id: userData.id || Date.now(),
            ...userData,
            registrationDate: userData.registrationDate || new Date().toISOString()
        };

        // Check if user already exists
        const existingIndex = this.users.findIndex(u => u.email === user.email || u.id === user.id);
        if (existingIndex === -1) {
            this.users.push(user);
            this.saveUsers();
            this.updateStats();
            this.renderUsers();
            this.renderFarmers();
            this.renderBuyers();
            console.log('User added to admin:', user.name);
        }
        return user;
    }

    // Delete user
    deleteUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
        this.saveUsers();
        this.updateStats();
        this.renderUsers();
    }

    // Get user by ID
    getUser(userId) {
        return this.users.find(user => user.id === userId);
    }

    // Update statistics
    updateStats() {
        const farmers = this.users.filter(user => user.role === 'farmer').length;
        const buyers = this.users.filter(user => user.role === 'buyer').length;
        const total = this.users.length;

        // Count today's registrations
        const today = new Date().toDateString();
        const todayRegistrations = this.users.filter(user => {
            const userDate = new Date(user.registrationDate).toDateString();
            return userDate === today;
        }).length;

        document.getElementById('farmerCount').textContent = farmers;
        document.getElementById('buyerCount').textContent = buyers;
        document.getElementById('totalUsers').textContent = total;
        document.getElementById('recentUsers').textContent = todayRegistrations;

        // Document stats
        const pendingDocs = this.documents.filter(doc => doc.status === 'pending').length;
        const approvedDocs = this.documents.filter(doc => doc.status === 'approved').length;
        const rejectedDocs = this.documents.filter(doc => doc.status === 'rejected').length;

        // Farmer/Buyer specific stats
        const farmerDocs = this.documents.filter(doc => doc.userRole === 'farmer');
        const buyerDocs = this.documents.filter(doc => doc.userRole === 'buyer');
        const farmerPending = farmerDocs.filter(doc => doc.status === 'pending').length;
        const buyerPending = buyerDocs.filter(doc => doc.status === 'pending').length;
        const farmerApproved = farmerDocs.filter(doc => doc.status === 'approved').length;
        const buyerApproved = buyerDocs.filter(doc => doc.status === 'approved').length;

        if (document.getElementById('pendingDocs')) {
            document.getElementById('pendingDocs').textContent = pendingDocs;
            document.getElementById('approvedDocs').textContent = approvedDocs;
            document.getElementById('rejectedDocs').textContent = rejectedDocs;
        }

        if (document.getElementById('farmerCountTab')) {
            document.getElementById('farmerCountTab').textContent = farmers;
            document.getElementById('buyerCountTab').textContent = buyers;
            document.getElementById('farmerPendingDocs').textContent = farmerPending;
            document.getElementById('buyerPendingDocs').textContent = buyerPending;
            document.getElementById('farmerApprovedDocs').textContent = farmerApproved;
            document.getElementById('buyerApprovedDocs').textContent = buyerApproved;
        }
    }

    // Render farmers table
    renderFarmers() {
        const farmers = this.users.filter(user => user.role === 'farmer');
        const tbody = document.getElementById('farmersTableBody');

        if (farmers.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No farmers registered yet</td></tr>';
            return;
        }

        tbody.innerHTML = farmers.map(farmer => {
            const userDocs = this.documents.filter(doc => doc.userId === farmer.id || doc.userId === farmer.email);
            const docCount = userDocs.length;
            const approvedDocs = userDocs.filter(doc => doc.status === 'approved').length;
            const status = approvedDocs === docCount && docCount > 0 ? 'Verified' : 'Pending';

            return `
                <tr>
                    <td>${farmer.name}</td>
                    <td>${farmer.email}</td>
                    <td>${farmer.mobile}</td>
                    <td>${docCount} uploaded</td>
                    <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewUserDocuments('${farmer.id || farmer.email}')">
                            <i class="fas fa-eye"></i> View Docs
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render buyers table
    renderBuyers() {
        const buyers = this.users.filter(user => user.role === 'buyer');
        const tbody = document.getElementById('buyersTableBody');

        if (buyers.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No buyers registered yet</td></tr>';
            return;
        }

        tbody.innerHTML = buyers.map(buyer => {
            const userDocs = this.documents.filter(doc => doc.userId === buyer.id || doc.userId === buyer.email);
            const docCount = userDocs.length;
            const approvedDocs = userDocs.filter(doc => doc.status === 'approved').length;
            const status = approvedDocs === docCount && docCount > 0 ? 'Verified' : 'Pending';

            return `
                <tr>
                    <td>${buyer.name}</td>
                    <td>${buyer.email}</td>
                    <td>${buyer.mobile}</td>
                    <td>${docCount} uploaded</td>
                    <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewUserDocuments('${buyer.id || buyer.email}')">
                            <i class="fas fa-eye"></i> View Docs
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    renderUsers(filteredUsers = null) {
        const tbody = document.getElementById('usersTableBody');
        const usersToRender = filteredUsers || this.users;

        if (usersToRender.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="7">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = usersToRender.map(user => `
            <tr>
                <td>#${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td><span class="role-badge role-${user.role}">${user.role}</span></td>
                <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn btn-view" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Render documents table
    renderDocuments(filteredDocs = null) {
        const tbody = document.getElementById('documentsTableBody');
        const docsToRender = filteredDocs || this.documents;

        if (docsToRender.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="7">No documents found</td></tr>';
            return;
        }

        tbody.innerHTML = docsToRender.map(doc => {
            const user = this.getUser(doc.userId);
            const fileSizeKB = doc.fileSize ? Math.round(doc.fileSize / 1024) : 'N/A';
            return `
                <tr>
                    <td>#${doc.id}</td>
                    <td>${user ? user.name : doc.userName || 'Unknown'}</td>
                    <td>${doc.documentType}</td>
                    <td>${doc.fileName} (${fileSizeKB}KB)</td>
                    <td>${new Date(doc.uploadDate).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${doc.status}">${doc.status}</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="viewDocument(${doc.id})">
                            <i class="fas fa-eye"></i> Review
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Filter users by role
    filterByRole(role) {
        if (role === 'all') {
            this.renderUsers();
        } else {
            const filtered = this.users.filter(user => user.role === role);
            this.renderUsers(filtered);
        }
    }

    // Filter documents by status
    filterDocuments(status) {
        if (status === 'all') {
            this.renderDocuments();
        } else {
            const filtered = this.documents.filter(doc => doc.status === status);
            this.renderDocuments(filtered);
        }
    }

    // Search users
    searchUsers(query) {
        if (!query.trim()) {
            this.renderUsers();
            return;
        }

        const filtered = this.users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.mobile.includes(query)
        );
        this.renderUsers(filtered);
    }

    // Approve document
    approveDocument(docId) {
        fetch(`/api/documents/${docId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'approved', rejectionReason: null })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Document approved:', data);
                // Update local data
                const docIndex = this.documents.findIndex(doc => doc.id === docId);
                if (docIndex !== -1) {
                    this.documents[docIndex] = data;
                }
                this.saveDocuments();
                this.updateStats();
                this.renderDocuments();
            })
            .catch(error => {
                console.error('Approval error:', error);
                // Fallback to local update
                const docIndex = this.documents.findIndex(doc => doc.id === docId);
                if (docIndex !== -1) {
                    this.documents[docIndex].status = 'approved';
                    this.documents[docIndex].rejectionReason = null;
                    this.saveDocuments();
                    this.updateStats();
                    this.renderDocuments();
                }
            });
    }

    // Reject document
    rejectDocument(docId, reason) {
        fetch(`/api/documents/${docId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Document rejected:', data);
                // Update local data
                const docIndex = this.documents.findIndex(doc => doc.id === docId);
                if (docIndex !== -1) {
                    this.documents[docIndex] = data;
                }
                this.saveDocuments();
                this.updateStats();
                this.renderDocuments();
            })
            .catch(error => {
                console.error('Rejection error:', error);
                // Fallback to local update
                const docIndex = this.documents.findIndex(doc => doc.id === docId);
                if (docIndex !== -1) {
                    this.documents[docIndex].status = 'rejected';
                    this.documents[docIndex].rejectionReason = reason;
                    this.saveDocuments();
                    this.updateStats();
                    this.renderDocuments();
                }
            });
    }

    // Export data to CSV
    exportToCSV() {
        if (this.users.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Mobile', 'Role', 'Registration Date'];
        const csvContent = [
            headers.join(','),
            ...this.users.map(user => [
                user.id,
                `"${user.name}"`,
                user.email,
                user.mobile,
                user.role,
                new Date(user.registrationDate).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `farm2market_users_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to delete all user data? This action cannot be undone.')) {
            this.users = [];
            this.documents = [];
            this.saveUsers();
            this.saveDocuments();
            this.updateStats();
            this.renderUsers();
            this.renderDocuments();
            alert('All data has been cleared');
        }
    }

    // Poll for new registrations from main website
    startPolling() {
        // Initial load
        this.checkForNewRegistrations();
        this.checkForNewDocuments();

        setInterval(() => {
            this.checkForNewRegistrations();
            this.checkForNewDocuments();
        }, 1000); // Check every 1 second for faster updates
    }

    // Check for new registrations from main website
    checkForNewRegistrations() {
        // Check multiple sources for new user data
        const newUserProfile = localStorage.getItem('newUserProfile');
        const allUsers = JSON.parse(localStorage.getItem('farm2market_users') || '[]');

        // Process single new user
        if (newUserProfile) {
            try {
                const userData = JSON.parse(newUserProfile);
                const existingUser = this.users.find(user => user.email === userData.email);
                if (!existingUser) {
                    this.addUser(userData);
                    console.log('New user added:', userData.name);
                }
                localStorage.removeItem('newUserProfile');
            } catch (error) {
                console.error('Error processing new registration:', error);
            }
        }

        // Sync with all users from localStorage
        allUsers.forEach(user => {
            const existingUser = this.users.find(u => u.email === user.email || u.id === user.id);
            if (!existingUser) {
                this.users.push(user);
                console.log('Synced user from localStorage:', user.name);
            }
        });
    }

    // Check for new documents
    checkForNewDocuments() {
        const storedDocs = JSON.parse(localStorage.getItem('farm2market_documents') || '[]');

        storedDocs.forEach(doc => {
            const existingDoc = this.documents.find(d => d.id === doc.id);
            if (!existingDoc) {
                this.documents.push(doc);
                console.log('New document detected:', doc.fileName);
            }
        });

        if (storedDocs.length !== this.documents.length) {
            this.updateStats();
            this.renderDocuments();
            this.renderFarmers();
            this.renderBuyers();
        }
    }
}

// Initialize admin database
let adminDB;

// Check login on page load
document.addEventListener('DOMContentLoaded', function () {
    adminDB = new AdminDatabase();

    // Force initial data load
    setTimeout(() => {
        adminDB.checkForNewRegistrations();
        adminDB.checkForNewDocuments();
        adminDB.updateStats();
        adminDB.renderUsers();
        adminDB.renderFarmers();
        adminDB.renderBuyers();
        adminDB.renderDocuments();
    }, 500);
});

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');

    // Refresh data for specific tabs
    if (tabName === 'farmers') {
        adminDB.renderFarmers();
    } else if (tabName === 'buyers') {
        adminDB.renderBuyers();
    }
}

// Global functions for UI interactions
function filterUsers() {
    const roleFilter = document.getElementById('roleFilter').value;
    adminDB.filterByRole(roleFilter);
}

function filterDocuments() {
    const statusFilter = document.getElementById('statusFilter').value;
    adminDB.filterDocuments(statusFilter);
}

function searchUsers() {
    const searchQuery = document.getElementById('searchInput').value;
    adminDB.searchUsers(searchQuery);
}

function viewUser(userId) {
    const user = adminDB.getUser(userId);
    if (user) {
        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nRole: ${user.role}\nRegistered: ${new Date(user.registrationDate).toLocaleString()}`);
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        adminDB.deleteUser(userId);
        alert('User deleted successfully');
    }
}

function viewUserDocuments(userId) {
    const userDocs = adminDB.documents.filter(doc => doc.userId === userId);
    if (userDocs.length === 0) {
        alert('No documents uploaded by this user');
        return;
    }

    // Show first document or create a list view
    viewDocument(userDocs[0].id);
}

function viewDocument(docId) {
    const doc = adminDB.documents.find(d => d.id === docId);
    if (doc) {
        adminDB.currentDocument = doc;
        const fileSizeKB = doc.fileSize ? Math.round(doc.fileSize / 1024) : 'N/A';
        const user = adminDB.getUser(doc.userId);

        let documentPreview = '';
        if (doc.fileData.startsWith('data:image')) {
            documentPreview = `<img src="${doc.fileData}" alt="Document" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd; border-radius: 8px;">`;
        } else if (doc.fileType === 'application/pdf') {
            documentPreview = `
                <div style="text-align: center; padding: 40px; border: 2px dashed #ddd; border-radius: 8px; background: #f8f9fa;">
                    <i class="fas fa-file-pdf" style="font-size: 4rem; color: #e74c3c; margin-bottom: 15px;"></i>
                    <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 10px;">PDF Document</p>
                    <p style="color: #666;">PDF preview not available. Click download to view.</p>
                    <a href="${doc.fileData}" download="${doc.fileName}" class="btn-download" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                        <i class="fas fa-download"></i> Download PDF
                    </a>
                </div>
            `;
        } else {
            documentPreview = `
                <div style="text-align: center; padding: 40px; border: 2px dashed #ddd; border-radius: 8px; background: #f8f9fa;">
                    <i class="fas fa-file" style="font-size: 4rem; color: #95a5a6; margin-bottom: 15px;"></i>
                    <p>File type not supported for preview</p>
                    <a href="${doc.fileData}" download="${doc.fileName}" class="btn-download" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                        <i class="fas fa-download"></i> Download File
                    </a>
                </div>
            `;
        }

        document.getElementById('documentViewer').innerHTML = `
            <div class="document-details">
                <h4>${doc.fileName}</h4>
                <div class="document-info-grid">
                    <div class="info-item">
                        <strong>User:</strong> ${user ? user.name : doc.userName || 'Unknown'}
                    </div>
                    <div class="info-item">
                        <strong>Role:</strong> ${doc.userRole}
                    </div>
                    <div class="info-item">
                        <strong>Document Type:</strong> ${doc.documentType}
                    </div>
                    <div class="info-item">
                        <strong>File Size:</strong> ${fileSizeKB} KB
                    </div>
                    <div class="info-item">
                        <strong>File Type:</strong> ${doc.fileType}
                    </div>
                    <div class="info-item">
                        <strong>Upload Date:</strong> ${new Date(doc.uploadDate).toLocaleString()}
                    </div>
                </div>
            </div>
            <div class="document-preview">
                ${documentPreview}
            </div>
        `;
        document.getElementById('documentModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('documentModal').style.display = 'none';
    document.getElementById('rejectForm').style.display = 'none';
}

function approveDocument() {
    if (adminDB.currentDocument) {
        adminDB.approveDocument(adminDB.currentDocument.id);
        closeModal();
        alert('Document approved successfully');
    }
}

function showRejectForm() {
    document.getElementById('rejectForm').style.display = 'block';
}

function rejectDocument() {
    const reason = document.getElementById('rejectionReason').value;
    if (!reason.trim()) {
        alert('Please enter a rejection reason');
        return;
    }

    if (adminDB.currentDocument) {
        adminDB.rejectDocument(adminDB.currentDocument.id, reason);
        closeModal();
        alert('Document rejected successfully');
    }
}

function exportData() {
    adminDB.exportToCSV();
}

function clearData() {
    adminDB.clearAllData();
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    window.location.href = 'login.html';
}

// Auto-refresh every 30 seconds
setInterval(() => {
    if (adminDB) {
        adminDB.updateStats();
    }
}, 30000);