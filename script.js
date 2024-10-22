// Constants for tax calculation and user authentication
const TAX_RATE = 0.15;
const USERNAME = "user";
const PASSWORD = "password123";
let attempts = 0;

// Function to calculate total and store selected services
const calculateTotal = () => {
    try {
        let total = 0;
        const servicesOrdered = []; // Array to store selected services
        const serviceCheckboxes = document.querySelectorAll('.service-checkbox');

        if (serviceCheckboxes.length === 0) {
            throw new Error("No service checkboxes found.");
        }

        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const costs = checkbox.dataset.costs ? JSON.parse(checkbox.dataset.costs) : null;
                const serviceName = checkbox.dataset.serviceName; // Assuming service name is in data attribute
                const serviceCost = parseFloat(checkbox.dataset.cost); // Cost from data attribute
                
                // If sizes exist, select the size price
                if (costs) {
                    const selectedSize = checkbox.closest('.service-item').querySelector('.size-select').value;
                    total += costs[selectedSize] || 1; // Add default value if no size is found
                } else {
                    total += serviceCost;
                }

                // Push to services array for session storage
                servicesOrdered.push({ name: serviceName, cost: serviceCost });
            }
        });

        // Store services and subtotal in sessionStorage
        sessionStorage.setItem('servicesOrdered', JSON.stringify(servicesOrdered));
        sessionStorage.setItem('subtotal', total.toFixed(2));

        // Update the displayed total cost
        const totalCostElement = document.getElementById('total-cost');
        if (totalCostElement) {
            totalCostElement.innerText = total.toFixed(2);
        } else {
            throw new Error("Total cost display element not found.");
        }

    } catch (error) {
        console.error("Error calculating total cost:", error);
        alert("There was an issue calculating the total cost. Please try again.");
    }
};

// Function to initialize invoice details
const initializeInvoice = () => {
    try {
        // Retrieve data from sessionStorage
        const servicesOrdered = JSON.parse(sessionStorage.getItem('servicesOrdered')) || [];
        const subtotal = parseFloat(sessionStorage.getItem('subtotal')) || 0;

        if (servicesOrdered.length === 0 || subtotal === 0) {
            throw new Error("No services or subtotal found in session storage.");
        }

        // Inject services into invoice page
        const servicesList = document.getElementById("ordered-services");
        servicesOrdered.forEach(service => {
            const serviceItem = document.createElement("li");
            serviceItem.innerText = `${service.name}: $${service.cost.toFixed(2)}`;
            servicesList.appendChild(serviceItem);
        });

        // Display subtotal
        document.getElementById("total-cost").innerText = subtotal.toFixed(2);

        // Calculate tax and total
        const taxes = subtotal * TAX_RATE;
        const total = subtotal + taxes;

        // Display taxes and total
        document.getElementById("taxes").innerText = taxes.toFixed(2);
        document.getElementById("total").innerText = total.toFixed(2);

        // Set the current date
        document.getElementById("invoice-date").innerText = new Date().toLocaleDateString();

    } catch (error) {
        console.error("Error initializing invoice:", error);
        alert("There was an issue loading the invoice. Please try again.");
    }
};

// Login form handling
document.getElementById("loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const inputUser = document.getElementById("username").value;
        const inputPass = document.getElementById("password").value;

        if (inputUser === USERNAME && inputPass === PASSWORD) {
            window.location.href = "services.html"; // Redirect to services page
        } else {
            attempts++;
            const errorMessage = document.getElementById("error-message");
            if (errorMessage) {
                errorMessage.innerText = `Incorrect login details. Attempt ${attempts}/3.`;
            }

            if (attempts >= 3) {
                window.location.href = "error.html"; // Redirect to error page after 3 attempts
            }
        }
    } catch (error) {
        console.error("Error during login process:", error);
        alert("An error occurred during the login process. Please try again.");
    }
});

// Add event listeners for total calculation
const setupServiceCheckboxListeners = () => {
    try {
        const checkboxes = document.querySelectorAll('.service-checkbox');
        if (checkboxes.length > 0) {
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', calculateTotal);
            });
        } else {
            throw new Error("No checkboxes found to add event listeners.");
        }
    } catch (error) {
        console.error("Error adding event listeners to checkboxes:", error);
        alert("An issue occurred while setting up service selection. Please refresh the page.");
    }
};

// Initialize event listeners when DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    setupServiceCheckboxListeners();

    // If on the invoice page, initialize invoice details
    if (window.location.pathname.includes('invoice.html')) {
        initializeInvoice();
    }
});

// Checkout functionality
try {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const totalCost = document.getElementById('total-cost').innerText;
            if (parseFloat(totalCost) > 0) {
                console.log(`Proceeding to checkout with total: $${totalCost}`);
                window.location.href = "invoice.html"; // Redirect to the invoice page
            } else {
                alert('Please select at least one service.');
            }
        });
    } else {
        throw new Error("Checkout button not found.");
    }
} catch (error) {
    console.error("Error handling checkout process:", error);
    alert("An error occurred during checkout. Please try again.");
}

// Cancel function
const cancel = () => {
    try {
        window.location.href = "services.html"; // Redirect back to services
    } catch (error) {
        console.error("Error during cancel process:", error);
    }
};

// Exit function
const exit = () => {
    try {
        window.location.href = "index.html"; // Redirect to the index page
    } catch (error) {
        console.error("Error during exit process:", error);
    }
};
