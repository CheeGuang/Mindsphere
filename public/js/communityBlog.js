$(document).ready(function () {
  const API_URL = `${window.location.origin}/api/blog`; // Replace with your actual API URL
  const userID = 1; // Replace with the logged-in user's ID
  let activeFilterCategoryID = null; // Track the active filter category
  let selectedPosterType = null; // Track the selected poster type

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
                          <div class="col-12 mb-3 post-card" data-post-id="${
                            post.postID
                          }">
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
                                  <span class="badge ms-2" style="background-color: ${
                                    post.posterType === "Child"
                                      ? "#23a925"
                                      : "#fda415"
                                  }; color: black;">${post.posterType}</span>
                                </h6>
                                <p class="card-text">${highlightText(
                                  post.content
                                )}</p>
                                <div class="d-flex justify-content-end align-items-center">
                                  <div>
                                    <i class="fas fa-thumbs-up like-button ${
                                      isLiked ? "text-primary" : ""
                                    }" 
                                       data-post-id="${
                                         post.postID
                                       }"></i> <span>${
                  post.numberOfLikes
                }</span>
                                    <i class="fas fa-comments ms-3 comment-button" data-post-id="${
                                      post.postID
                                    }"></i> <span>${
                  post.numberOfComments
                }</span>
                                  </div>
                                </div>
                              </div>
                              <div class="comments-container d-none" style="padding:1rem"></div>
                              <div class="add-comment-container d-none" style="padding:1rem; margin-top:-10px !important;">
                                <textarea class="form-control mb-2" placeholder="Add a comment..."></textarea>
                                <div class="d-flex justify-content-start my-4">
                                  <button class="btn-pill me-2 set-poster-type-pill" data-poster-type="Child">Child</button>
                                  <button class="btn-pill set-poster-type-pill" data-poster-type="Parent">Parent</button>
                                </div>
                                <button class="btn btn-primary btn-sm add-comment-button" data-post-id="${
                                  post.postID
                                }" disabled>Submit</button>
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

  // Function to load comments for a post
  function loadComments(postID, commentsContainer) {
    $.ajax({
      url: `${API_URL}/post-with-comments/${postID}`,
      method: "GET",
      success: function (response) {
        console.log("API Response for comments:", response); // Debug: Log the API response

        // Response is directly an array of comments
        const comments = response || []; // Default to an empty array if undefined
        if (!Array.isArray(comments)) {
          console.error("Invalid comments data:", comments); // Debug: Invalid response structure
          return;
        }

        commentsContainer.empty(); // Clear previous comments
        comments.forEach((comment) => {
          const posterTypeColor =
            comment.posterType === "Child" ? "#23a925" : "#fda415";
          const commentHTML = `
                <div class="comment mb-2">
                  <strong>${comment.authorName}</strong> <span class="badge" style="background-color: ${posterTypeColor}; color: black;">${comment.posterType}</span>
                  <p>${comment.comment}</p>
                </div>`;
          commentsContainer.append(commentHTML);
        });

        if (comments.length > 0) {
          commentsContainer.prepend("<hr class='mb-4'>"); // Add a horizontal line above comments
          commentsContainer.removeClass("d-none"); // Show the comments container
        } else {
          console.log("No comments available for this post."); // Debug: No comments
        }
      },
      error: function (err) {
        console.error("Error loading comments:", err); // Debug: Log the error
      },
    });
  }

  // Function to add a comment
  function addComment(postID, commentText, posterType, commentsContainer) {
    $.ajax({
      url: `${API_URL}/add-comment`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        postID: postID,
        memberID: userID,
        comment: commentText,
        posterType: posterType,
      }),
      success: function () {
        loadComments(postID, commentsContainer); // Reload comments after adding
      },
      error: function (err) {
        console.error("Error adding comment:", err);
      },
    });
  }

  // Event listener for like button
  $("#postsContainer").on("click", ".like-button", function () {
    const postID = $(this).data("post-id");
    const isLiked = $(this).hasClass("text-primary");
    toggleLike(postID, isLiked);
  });

  // Event listener for comment button
  $("#postsContainer").on("click", ".comment-button", function () {
    const postID = $(this).data("post-id");
    const postCard = $(this).closest(".post-card");
    const commentsContainer = postCard.find(".comments-container");
    const addCommentContainer = postCard.find(".add-comment-container");
    if (commentsContainer.hasClass("d-none")) {
      // Load comments only if not already expanded
      loadComments(postID, commentsContainer);
      addCommentContainer.removeClass("d-none");
    } else {
      commentsContainer.addClass("d-none"); // Collapse comments if already expanded
      addCommentContainer.addClass("d-none");
    }
  });

  // Event listener for selecting poster type
  $("#postsContainer").on("click", ".set-poster-type-pill", function () {
    const pill = $(this);
    const postCard = pill.closest(".post-card");
    const submitButton = postCard.find(".add-comment-button");
    const commentText = postCard.find("textarea").val().trim();

    pill.siblings().removeClass("active");
    pill.addClass("active");

    selectedPosterType = pill.data("poster-type");

    // Enable submit button only if both poster type is selected and comment text is not empty
    submitButton.prop("disabled", !(selectedPosterType && commentText));
  });

  // Event listener for typing in the comment box
  $("#postsContainer").on("input", "textarea", function () {
    const textarea = $(this);
    const postCard = textarea.closest(".post-card");
    const submitButton = postCard.find(".add-comment-button");
    const commentText = textarea.val().trim();

    // Enable submit button only if both poster type is selected and comment text is not empty
    submitButton.prop("disabled", !(selectedPosterType && commentText));
  });

  // Event listener for add comment button
  $("#postsContainer").on("click", ".add-comment-button", function () {
    const postID = $(this).data("post-id");
    const postCard = $(this).closest(".post-card");
    const commentsContainer = postCard.find(".comments-container");
    const commentText = postCard.find("textarea").val().trim();

    if (!selectedPosterType) {
      alert(
        "Please select 'Child' or 'Parent' before submitting your comment."
      );
      return;
    }

    if (commentText) {
      addComment(postID, commentText, selectedPosterType, commentsContainer);
      postCard.find("textarea").val(""); // Clear the textarea
      selectedPosterType = null; // Reset selection after submission
      postCard.find(".set-poster-type-pill").removeClass("active"); // Reset pill states
      postCard.find(".add-comment-button").prop("disabled", true); // Disable submit button
    }
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
