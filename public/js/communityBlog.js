$(document).ready(function () {
  const API_URL = `${window.location.origin}/api/blog`; // Replace with your actual API URL
  const userID = 1; // Replace with the logged-in user's ID
  let activeFilterCategoryID = null; // Track the active filter category

  // Function to load filter pills
  function loadFilters() {
    $.ajax({
      url: `${API_URL}/categories`,
      method: "GET",
      success: function (categories) {
        const filterPillsContainer = $("#filterPillsContainer");
        filterPillsContainer.empty();
        categories.forEach((category) => {
          const pill = `<span class="badge bg-primary m-1 filter-pill" data-category-id="${category.categoryID}">${category.categoryName}</span>`;
          filterPillsContainer.append(pill);
        });
      },
      error: function (err) {
        console.error("Error loading categories:", err);
      },
    });
  }

  // Function to load posts
  function loadPosts(filterCategoryID = null, searchQuery = "") {
    let endpoint = `${API_URL}/posts`;
    if (filterCategoryID) {
      endpoint = `${API_URL}/posts-by-category/${filterCategoryID}`;
    }

    $.ajax({
      url: endpoint,
      method: "GET",
      success: function (posts) {
        // Fetch liked posts for the user
        $.ajax({
          url: `${API_URL}/liked-posts/${userID}`,
          method: "GET",
          success: function (likedPosts) {
            const likedPostIDs = (
              Array.isArray(likedPosts) ? likedPosts : likedPosts.data || []
            ).map((post) => post.postID);

            const postsContainer = $("#postsContainer");
            postsContainer.empty();

            posts
              .filter(
                (post) =>
                  post.title.toLowerCase().includes(searchQuery) ||
                  post.content.toLowerCase().includes(searchQuery)
              ) // Apply search filter
              .forEach((post) => {
                const isLiked = likedPostIDs.includes(post.postID);

                // Highlight the search terms
                const highlightText = (text) => {
                  if (!searchQuery) return text;
                  const regex = new RegExp(`(${searchQuery})`, "gi");
                  return text.replace(regex, `<mark>$1</mark>`);
                };

                const postCard = `
                    <div class="col-12 mb-3">
                      <div class="card">
                        <div class="card-body">
                          <h5 class="card-title">${highlightText(
                            post.title
                          )}</h5>
                          <h6 class="card-subtitle my-3 text-muted">
                            By ${post.author} 
                            <span class="badge bg-secondary ms-2">${
                              post.categoryName
                            }</span>
                          </h6>
                          <p class="card-text">${highlightText(
                            post.content
                          )}</p>
                          <div class="d-flex justify-content-end align-items-center">
                            <div>
                              <i class="fas fa-thumbs-up like-button ${
                                isLiked ? "text-primary" : ""
                              }" 
                                 data-post-id="${post.postID}"></i> <span>${
                  post.numberOfLikes
                }</span>
                              <i class="fas fa-comments ms-3"></i> <span>${
                                post.numberOfComments
                              }</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`;

                postsContainer.append(postCard);
              });
          },
          error: function (err) {
            console.error("Error fetching liked posts:", err);
          },
        });
      },
      error: function (err) {
        console.error("Error loading posts:", err);
      },
    });
  }

  // Function to toggle like
  function toggleLike(postID, isLiked) {
    const url = `${API_URL}/${isLiked ? "remove-upvote" : "upvote-post"}`;
    const method = "POST";

    $.ajax({
      url: url,
      method: method,
      contentType: "application/json",
      data: JSON.stringify({ postID: postID, memberID: userID }),
      success: function () {
        loadPosts(activeFilterCategoryID); // Reload posts with active filter
      },
      error: function (err) {
        console.error("Error toggling like:", err);
      },
    });
  }

  // Event listener for like button
  $("#postsContainer").on("click", ".like-button", function () {
    const postID = $(this).data("post-id");
    const isLiked = $(this).hasClass("text-primary");
    toggleLike(postID, isLiked);
  });

  // Event listener for filter pills
  $("#filterPillsContainer").on("click", ".filter-pill", function () {
    $(".filter-pill").removeClass("active"); // Remove 'active' class from all pills
    $(this).addClass("active"); // Add 'active' class to the clicked pill
    activeFilterCategoryID = $(this).data("category-id");
    loadPosts(activeFilterCategoryID, $("#searchBar").val().toLowerCase()); // Filter posts based on active filter and search query
  });

  // Event listener for search bar
  $("#searchBar").on("input", function () {
    const searchQuery = $(this).val().toLowerCase();
    loadPosts(activeFilterCategoryID, searchQuery); // Search within the active filter
  });

  // Initial loading of filters and posts
  loadFilters();
  loadPosts();
});
