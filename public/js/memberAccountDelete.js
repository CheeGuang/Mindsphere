document.addEventListener("DOMContentLoaded", function () {
    const deleteAccountForm = document.getElementById("deleteAccountForm");
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const confirmTextInput = document.getElementById("confirmText");
    const errorMsg = new bootstrap.Modal(document.getElementById("errorModal"));
    const errorMessage = document.getElementById("errorMessage");

    // Enforce uppercase as the user types
    confirmTextInput.addEventListener("input", function () {
        confirmTextInput.value = confirmTextInput.value.toUpperCase();
    });

    deleteAccountForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Check if user typed "DELETE" in uppercase
        const confirmText = confirmTextInput.value;
        if (confirmText === "DELETE") {
            // Show confirmation modal
            confirmDeleteModal.show();
        } else {
            errorMessage.textContent = "Please type 'DELETE' exactly to confirm account deletion.";
            errorMsg.show();
        }
    });

    // Event listener for final confirmation button in the modal
    confirmDeleteButton.addEventListener("click", async function () {
        confirmDeleteModal.hide();

        // Get member ID from localStorage
        const memberData = JSON.parse(localStorage.getItem("memberDetails"));
        const memberID = memberData ? memberData.memberID : null;

        if (memberID) {
            // Attempt to delete the member
            const result = await deleteMember(memberID);

            if (result.error) {
                // Display error modal with the error message
                errorMessage.textContent = "Failed to delete member! ";
                errorMsg.show();
            } else {
                console.log("Account deletion confirmed.");
                localStorage.clear();
                window.location.href = "/index.html"; // Redirect to index page after successful deletion
            }
        } else {
            errorMessage.textContent = "Member ID not found. Please try again.";
            errorMsg.show();
        }
    });
});

async function deleteMember(memberID) {
    try {
        const response = await fetch(`/api/member/delete-member/${memberID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.message);
        return result;
    } catch (error) {
        console.error("Failed to delete member:", error);
        return { error: error.message };
    }
}
