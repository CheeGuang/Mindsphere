$(document).ready(function () {
  // Fetch vouchers from the API
  function fetchVouchers() {
    const memberID = 1; // Replace with dynamic memberID if needed

    $.ajax({
      url: `api/voucher/${memberID}`, // API endpoint for fetching vouchers
      method: "GET",
      success: function (response) {
        if (response.success) {
          const vouchers = response.data;
          populateVouchers(vouchers);
        } else {
          console.error("Failed to fetch vouchers:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching vouchers:", error);
      },
    });
  }

  // Populate the vouchers dynamically into the HTML
  function populateVouchers(vouchers) {
    const $vouchersContainer = $("#vouchersContainer");
    $vouchersContainer.empty(); // Clear existing content

    vouchers.forEach((voucher) => {
      const cardHTML = `
          <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <div
              class="card border-0"
              style="
                border-radius: 20px;
                overflow: hidden;
                width: 100%;
                max-width: 400px;
                height: 250px;
              "
            >
              <div class="position-relative"></div>
              <div
                class="card-body text-center"
                style="
                  background: linear-gradient(135deg, #3c4ad1, #7a91e2);
                  color: #fff;
                  padding: 30px;
                "
              >
                <h5
                  class="card-title"
                  style="
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 15px;
                  "
                >
                  Gift Card
                </h5>
                <p
                  class="text-muted"
                  style="
                    color: rgba(255, 255, 255, 0.8) !important;
                    font-size: 1.2rem;
                  "
                >
                  $${voucher.value} Value, Minimum Spend: $${
        voucher.minimumSpend
      }<br />
                  Expire: ${new Date(
                    voucher.expiryDate
                  ).toLocaleDateString()}<br />
                </p>
                <button
                  class="btn btn-light mt-4"
                  style="
                    color: #3c4ad1;
                    font-weight: bold;
                    border-radius: 30px;
                    padding: 12px 25px;
                  "
                  onclick="window.location.href='guestProgrammes.html';"
                >
                  Redeem Now
                </button>
              </div>
            </div>
          </div>
        `;
      $vouchersContainer.append(cardHTML);
    });
  }

  // Fetch vouchers on page load
  fetchVouchers();
});
