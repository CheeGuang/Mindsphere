$(document).ready(function () {
  // Fetch vouchers from the API
  function fetchVouchers() {
    const memberDetails = localStorage.getItem("memberDetails");
    if (!memberDetails) {
      console.error("No member details found in localStorage.");
      return;
    }

    const memberID = JSON.parse(memberDetails).memberID;
    console.debug("Fetching vouchers for memberID:", memberID);

    $.ajax({
      url: `api/voucher/${memberID}`, // API endpoint for fetching vouchers
      method: "GET",
      success: function (response) {
        console.debug("API Response:", response);

        if (response.success) {
          const vouchers = response.data;
          console.debug("Vouchers received:", vouchers);
          populateVouchers(vouchers);
        } else {
          console.error("Failed to fetch vouchers:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error during voucher fetch:", {
          status: status,
          error: error,
          responseText: xhr.responseText,
        });
      },
    });
  }

  // Populate the vouchers dynamically into the HTML
  function populateVouchers(vouchers) {
    console.debug("Populating vouchers:", vouchers);

    const $vouchersContainer = $("#vouchersContainer");
    const $expiredVouchersContainer = $("#expiredVouchersContainer");
    const $noVouchersMessage = $("#noVouchersMessage");
    const $noExpiredVouchersMessage = $("#noExpiredVouchersMessage");

    $vouchersContainer.empty(); // Clear existing content
    $expiredVouchersContainer.empty(); // Clear existing expired vouchers

    // Filter vouchers based on redeemed status
    const activeVouchers = vouchers.filter(
      (voucher) => voucher.redeemed === false
    );
    const expiredVouchers = vouchers.filter(
      (voucher) => voucher.redeemed === true
    );

    console.debug("Active Vouchers:", activeVouchers);
    console.debug("Expired Vouchers:", expiredVouchers);

    // Handle active vouchers
    if (activeVouchers.length > 0) {
      $noVouchersMessage.hide(); // Hide "No Gift Cards" message
      activeVouchers.forEach((voucher) => {
        const cardHTML = `
          <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <div
              class="card border-0"
              style="border-radius: 20px; overflow: hidden; width: 100%; max-width: 400px; height: 250px;"
            >
              <div class="position-relative"></div>
              <div
                class="card-body text-center"
                style="background: linear-gradient(135deg, #3c4ad1, #7a91e2); color: #fff; padding: 30px;"
              >
                <h5
                  class="card-title"
                  style="font-size: 2rem; font-weight: bold; margin-bottom: 15px;"
                >
                  Gift Card
                </h5>
                <p
                  class="text-muted"
                  style="color: rgba(255, 255, 255, 0.8) !important; font-size: 1.2rem;"
                >
                  $${voucher.value} Value, Minimum Spend: $${
          voucher.minimumSpend
        }<br />
                  Expire: ${new Date(
                    voucher.expiryDate
                  ).toLocaleDateString()}<br />
                </p>
                <button
                  class="btn btn-light mt-4 redeem-now-btn"
                  style="color: #3c4ad1; font-weight: bold; border-radius: 30px; padding: 12px 25px;"
                >
                  Redeem Now
                </button>
              </div>
            </div>
          </div>
        `;
        $vouchersContainer.append(cardHTML);
      });
    } else {
      $noVouchersMessage.show(); // Show "No Gift Cards" message
    }

    // Handle expired vouchers
    if (expiredVouchers.length > 0) {
      $noExpiredVouchersMessage.hide(); // Hide "No Expired Gift Cards" message
      expiredVouchers.forEach((voucher) => {
        const cardHTML = `
          <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
      <div
        class="card border-0"
        style="border-radius: 20px; overflow: hidden; width: 100%; max-width: 400px; height: 250px;"
      >
        <div class="position-relative"></div>
        <div
          class="card-body text-center"
          style="background: linear-gradient(135deg, ${
            voucher.redeemed === 0 ? "#3c4ad1, #7a91e2" : "#d14a3c, #e27a7a"
          }); color: #fff; padding: 30px;"
        >
          <h5
            class="card-title"
            style="font-size: 2rem; font-weight: bold; margin-bottom: 15px;"
          >
            ${voucher.redeemed === 0 ? "Gift Card" : "Gift Card"}
          </h5>
          <p
            class="text-muted"
            style="color: rgba(255, 255, 255, 0.8) !important; font-size: 1.2rem;"
          >
            $${voucher.value} Value, Minimum Spend: $${
          voucher.minimumSpend
        }<br />
            ${voucher.redeemed === 0 ? "Expire: " : "Redeemed On: "}${new Date(
          voucher.redeemed === 0 ? voucher.expiryDate : voucher.redeemedDate
        ).toLocaleDateString()}<br />
          </p>
          ${
            voucher.redeemed === 0
              ? `<button
                  class="btn btn-light mt-4"
                  style="color: #3c4ad1; font-weight: bold; border-radius: 30px; padding: 12px 25px;"
                  onclick="window.location.href='guestProgrammes.html';"
                >
                  Redeem Now
                </button>`
              : `<button
                  class="btn btn-light mt-4 disabled"
                  style="color: #a0a0a0; font-weight: bold; border-radius: 30px; padding: 12px 25px; cursor: not-allowed;"
                  disabled
                >
                  Redeemed
                </button>`
          }
        </div>
      </div>
    </div>
        `;
        $expiredVouchersContainer.append(cardHTML);
      });
    } else {
      $noExpiredVouchersMessage.show(); // Show "No Expired Gift Cards" message
    }
  }

  // Fetch vouchers on page load
  fetchVouchers();

  // Function to show Telegram reminder modal
  function showTelegramReminderModal() {
    $("#telegramReminderModal").modal("show");
  }

  // Attach click event to dynamically added "Redeem Now" buttons
  $(document).on("click", ".redeem-now-btn", function (e) {
    e.preventDefault(); // Prevent default action
    showTelegramReminderModal();
  });

  // Redirect to the programme page when modal is closed
  $("#telegramReminderModal").on("hidden.bs.modal", function () {
    window.location.href = "guestProgrammes.html"; // Replace with your programme page URL
  });
});
