// Document Upload System for Users
class DocumentUploader {
    constructor() {
        this.documents = this.loadDocuments();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    loadDocuments() {
        const docs = localStorage.getItem('farm2market_documents');
        return docs ? JSON.parse(docs) : [];
    }

    saveDocuments() {
        localStorage.setItem('farm2market_documents', JSON.stringify(this.documents));
    }

    setupEventListeners() {
        // Farmer documents
        const aadharUpload = document.getElementById('aadharUpload');
        const landUpload = document.getElementById('landUpload');

        // Buyer documents
        const gstUpload = document.getElementById('gstUpload');
        const buyerAadharUpload = document.getElementById('buyerAadharUpload');

        if (aadharUpload) {
            aadharUpload.addEventListener('change', (e) => this.handleFileUpload(e, 'aadhar', 'farmer'));
        }
        if (landUpload) {
            landUpload.addEventListener('change', (e) => this.handleFileUpload(e, 'land', 'farmer'));
        }
        if (gstUpload) {
            gstUpload.addEventListener('change', (e) => this.handleFileUpload(e, 'gst', 'buyer'));
        }
        if (buyerAadharUpload) {
            buyerAadharUpload.addEventListener('change', (e) => this.handleFileUpload(e, 'aadhar', 'buyer'));
        }
    }

    async handleFileUpload(event, docType, userRole) {
        const file = event.target.files[0];
        if (!file) return;

        const statusElement = document.getElementById(this.getStatusElementId(docType, userRole));

        // Check file size (1MB = 1024 * 1024 bytes)
        const maxSize = 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            statusElement.innerHTML = '<i class="fas fa-times"></i> File too large (max 1MB)';
            statusElement.style.color = '#e74c3c';
            event.target.value = ''; // Clear the input
            return;
        }

        statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        statusElement.style.color = '#3498db';

        try {
            const document = await this.uploadDocument(file, docType, userRole);
            const fileSizeKB = Math.round(file.size / 1024);
            statusElement.innerHTML = `<i class="fas fa-check"></i> Uploaded (${fileSizeKB}KB)`;
            statusElement.style.color = '#27ae60';
        } catch (error) {
            statusElement.innerHTML = '<i class="fas fa-times"></i> Upload failed';
            statusElement.style.color = '#e74c3c';
        }
    }

    getStatusElementId(docType, userRole) {
        if (docType === 'aadhar' && userRole === 'buyer') return 'buyerAadharStatus';
        if (docType === 'aadhar') return 'aadharStatus';
        if (docType === 'land') return 'landStatus';
        if (docType === 'gst') return 'gstStatus';
        return 'uploadStatus';
    }

    uploadDocument(file, docType, userRole) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const userId = localStorage.getItem('userId') || Date.now().toString();
                const userName = localStorage.getItem('userName') || 'Unknown User';

                const document = {
                    userId: userId,
                    userName: userName,
                    userRole: userRole,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    documentType: docType,
                    fileData: e.target.result,
                    status: 'pending',
                    rejectionReason: null
                };

                // Send to server
                fetch('/api/documents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(document)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Document uploaded:', data);
                        // Also store locally for backward compatibility
                        this.documents.push(data);
                        this.saveDocuments();
                        resolve(data);
                    })
                    .catch(error => {
                        console.error('Upload error:', error);
                        // Fallback to local storage
                        const localDoc = { id: Date.now(), ...document, uploadDate: new Date().toISOString() };
                        this.documents.push(localDoc);
                        this.saveDocuments();
                        resolve(localDoc);
                    });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    getUserDocuments(userId) {
        return this.documents.filter(doc => doc.userId === userId);
    }
}

// Initialize document uploader when page loads
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('verification.html')) {
        new DocumentUploader();

        // Set user info from localStorage if available
        const userProfile = localStorage.getItem('newUserProfile');
        if (userProfile) {
            const user = JSON.parse(userProfile);
            localStorage.setItem('userId', user.email); // Use email as userId
            localStorage.setItem('userName', user.name);
        }
    }
});