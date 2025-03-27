const API_URL = "https://api.hyperteknoloji.com.tr/Products/List";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1NDA1MjI1MCwiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9.MqpEcAgXqQw3mwT6UYprGl6kIkghSDM9UvJsPrRJX4s";

async function getProducts() {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${TOKEN}`,
            }
        });

        if (!response.ok) throw new Error("Veri çekme başarısız!");
        
        const data = await response.json();
        return data.data.slice(0, 50);
    } catch (error) {
        console.error("Hata:", error);
        return [];
    }
}

function displayProducts(products) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = products.length ? "" : "<p>Ürün bulunamadı.</p>";

    products.forEach(product => {
        const productCard = `
            <div class="col-4">
                <div class="card product-card">
                    <div class="card-body">
                        <img src="${product.productData.productMainImage || ''}" class="img-fluid" alt="Ürün resmi">
                        <h5 class="card-title product-name">${product.productName}</h5>
                        <p class="card-text product-price">Fiyat: ${product.salePrice} TL</p>
                        <a href="#" class="btn btn-primary productDetailBtn"
                            data-img="${product.productData.productMainImage}"
                            data-name="${product.productName}"
                            data-description="${product.productData.productInfo || 'Açıklama yok'}"
                            data-price="${product.salePrice} TL"
                            data-btn="${product.productSlug}"
                            data-stock="${product.totalStock}">
                            Detay
                        </a>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });

    document.querySelectorAll(".productDetailBtn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("modalImg").src = this.getAttribute("data-img");
            document.getElementById("modalTitle").textContent = this.getAttribute("data-name");
            document.getElementById("modalDescription").textContent = this.getAttribute("data-description");
            document.getElementById("modalPrice").textContent = `Fiyat: ${this.getAttribute("data-price")}`;
            document.getElementById("modalStock").textContent = `Stok: ${this.getAttribute("data-stock")}`;

            const productSlug = this.getAttribute("data-btn");
            const modalBtn = document.getElementById("modalBtn");
            modalBtn.textContent = "Ürünü İncele";
            modalBtn.onclick = () => window.location.href = productSlug;

            document.getElementById("productModal").style.display = "flex";
        });
    });

    document.getElementById("modalClose").addEventListener("click", () => {
        document.getElementById("productModal").style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === document.getElementById("productModal")) {
            document.getElementById("productModal").style.display = "none";
        }
    });
}

getProducts().then(displayProducts).catch(error => console.error("Hata:", error));
