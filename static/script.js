document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERENSI ELEMENT ---
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const uploadArea = document.getElementById("uploadArea");
    const uploadPlaceholder = document.getElementById("uploadPlaceholder");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const fileName = document.getElementById("fileName");
    const browseBtn = document.getElementById("browseBtn");
    const changeBtn = document.getElementById("changeBtn");
    const submitBtn = document.getElementById("submitBtn");
    const loading = document.getElementById("loading");
    
    // Modal Elements
    const uploadModal = document.getElementById("uploadModal");
    const closeModal = document.getElementById("closeModal");
    const startClassificationBtn = document.getElementById("startClassificationBtn");
    const ctaBtn = document.querySelector(".cta-btn"); // Tombol di navbar

    // --- 2. LOGIKA MODAL ---
    
    // Fungsi buka modal
    function openModal() {
        if(uploadModal) uploadModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Disable scroll background
    }

    // Fungsi tutup modal
    function closeModalFunc() {
        if(uploadModal) uploadModal.style.display = "none";
        document.body.style.overflow = "auto"; // Enable scroll
    }

    // Event listeners modal
    if (startClassificationBtn) startClassificationBtn.addEventListener("click", openModal);
    if (ctaBtn) ctaBtn.addEventListener("click", openModal); // Tambahan untuk tombol navbar
    if (closeModal) closeModal.addEventListener("click", closeModalFunc);

    // Tutup jika klik di luar area modal
    window.addEventListener("click", (e) => {
        if (e.target === uploadModal) {
            closeModalFunc();
        }
    });

    // --- 3. LOGIKA UPLOAD & PREVIEW ---

    // Klik tombol browse
    if (browseBtn) {
        browseBtn.addEventListener("click", () => fileInput.click());
    }

    // Klik tombol ganti gambar
    if (changeBtn) {
        changeBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah bubbling ke uploadArea
            fileInput.value = ""; // Reset input
            uploadPlaceholder.style.display = "flex"; // Kembali ke tampilan awal
            previewContainer.style.display = "none";
            uploadArea.classList.remove("has-image");
        });
    }

    // Input file berubah
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) handleFileSelect(file);
        });
    }

    // Drag and Drop
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add("drag-over");
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove("drag-over");
            });
        });

        uploadArea.addEventListener("drop", (e) => {
            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files; // Update input file
                handleFileSelect(file);
            }
        });
    }

    // Fungsi Handle File
    function handleFileSelect(file) {
        // Validasi tipe
        if (!file.type.startsWith("image/")) {
            alert("Mohon upload file gambar (JPG, PNG, JPEG)");
            return;
        }

        // Validasi ukuran (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("Ukuran file terlalu besar. Maksimal 10MB");
            return;
        }

        // Preview Gambar
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            fileName.textContent = file.name;
            uploadPlaceholder.style.display = "none";
            previewContainer.style.display = "flex"; // Gunakan flex agar rapi
            uploadArea.classList.add("has-image");
        };
        reader.readAsDataURL(file);
    }

    // --- 4. FORM SUBMISSION (BAGIAN KRUSIAL) ---
    if (uploadForm) {
        uploadForm.addEventListener("submit", (e) => {
            // Validasi: Apakah ada file?
            if (!fileInput.files || fileInput.files.length === 0) {
                e.preventDefault(); // Mencegah submit jika kosong
                alert("Mohon pilih file gambar terlebih dahulu");
                return;
            }

            // TAMPILKAN LOADING
            // Kita TIDAK menggunakan e.preventDefault() di sini.
            // Biarkan form melakukan submit standard (POST) ke server.
            // Server akan merender result.html secara otomatis.
            
            submitBtn.style.display = "none";
            loading.style.display = "block";
            
            // Opsional: Sembunyikan area upload agar fokus ke loading
            uploadArea.style.display = "none";
        });
    }

    // --- 5. EFEK UI LAINNYA ---
    
    // Smooth scroll navbar
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Navbar shadow on scroll
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                navbar.style.background = "rgba(255, 255, 255, 0.95)";
            } else {
                navbar.style.boxShadow = "none";
                navbar.style.background = "var(--white)";
            }
        });
    }
});