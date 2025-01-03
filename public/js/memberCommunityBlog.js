$(document).ready(function () {
  const API_URL = `${window.location.origin}/api/blog`; // Replace with your actual API URL
  const userID = JSON.parse(localStorage.getItem("memberDetails")).memberID; // Replace with the logged-in user's ID
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

        // Add "All" filter option
        const allPill = `<span class="badge bg-primary m-1 filter-pill" data-category-id="all">All</span>`;
        filterPillsContainer.append(allPill);

        // Loop through categories and add each as a filter pill
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

  // Function to load meet-up events with optional filter
  function loadMeetUpEvents(filterCategoryID = null) {
    let endpoint = `${API_URL}/active-blog-meetups`;
    if (filterCategoryID) {
      endpoint = `${API_URL}/active-blog-meetups/${filterCategoryID}`;
    }

    $.ajax({
      url: endpoint,
      method: "GET",
      success: function (events) {
        const meetUpEventsContainer = $("#meetUpEventsContainer");
        meetUpEventsContainer.empty();

        console.log(events);
        events.forEach((event) => {
          // Determine event type based on isOnline
          const eventTypeBadge = event.isOnline
            ? '<span class="badge bg-success">Online</span>'
            : '<span class="badge bg-primary">In-Person</span>';

          // Construct the event card with dynamic data
          const eventCard = `
          <div class="col-12 col-md-6 col-lg-3 mb-4 meet-up-event-card" data-event-id="${
            event.meetUpID
          }">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${
                  event.title || "No Title Available"
                }</h5>
                <!-- Category badge below the title -->
                <span class="badge bg-secondary mb-3 post-category" style="margin-right:7px">${
                  event.categoryName || "No Category Available"
                }</span>
                ${eventTypeBadge}
                <p class="card-text">${
                  event.description || "No Description Available"
                }</p>
                ${
                  event.startDateTime
                    ? `<p class="card-text"><strong>Start Time:</strong> ${new Date(
                        event.startDateTime
                      ).toLocaleString()}</p>`
                    : ""
                }
                ${
                  event.endDateTime
                    ? `<p class="card-text"><strong>End Time:</strong> ${new Date(
                        event.endDateTime
                      ).toLocaleString()}</p>`
                    : ""
                }
                ${
                  event.venue
                    ? `<p class="card-text"><strong>Venue:</strong> ${event.venue}</p>`
                    : ""
                }
              </div>
              <!-- Footer with a simple button always at the bottom -->
              <div class="card-footer">
                <button class="btn btn-primary" onclick="window.open('${
                  event.link
                }', '_blank')">
                  ${
                    event.isOnline
                      ? "Click here to Join Call"
                      : "Click here to Sign Up"
                  }
                </button>
              </div>
            </div>
          </div>
        `;

          meetUpEventsContainer.append(eventCard);
        });
      },
      error: function (err) {
        console.error("Error loading meet-up events:", err);
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
                console.log(post);
                console.log(userID);
                const isOwnPost = post.memberID == userID; // Check if the post is created by the logged-in user

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
                    <div class="card-body position-relative">
                      <!-- Edit and Delete buttons positioned at top right -->
                      ${
                        isOwnPost
                          ? `
                            <div class="position-absolute top-0 end-0 p-2">
                              <button class="btn btn-warning btn-sm edit-button" data-post-id="${post.postID}">
                                <i class="fas fa-edit"></i>
                              </button>
                              <button class="btn btn-danger btn-sm delete-button ms-2" data-post-id="${post.postID}">
                                <i class="fas fa-trash-alt"></i>
                              </button>
                            </div>`
                          : ""
                      }
              
                      <h5 class="card-title">${highlightText(post.title)}</h5>
                      <h6 class="card-subtitle my-3 text-muted">
                        By ${post.author} 
                        <span class="badge bg-secondary ms-2 post-category">${
                          post.categoryName
                        }</span>
                        <span class="badge ms-2 post-posterType" style="background-color: ${
                          post.posterType === "Child" ? "#23a925" : "#fda415"
                        }; color: black;">${post.posterType}</span>
                      </h6>
                      <p class="card-text text-muted mb-3"><small>Last modified: ${new Date(
                        post.updatedAt
                      ).toLocaleString()}</small></p>
                      <p class="card-text card-content-text">${highlightText(
                        post.content
                      )}</p>
                      <div class="d-flex justify-content-end align-items-center">
                        <div>
                          <i class="fas fa-thumbs-up like-button ${
                            isLiked ? "text-primary" : ""
                          }" data-post-id="${post.postID}"></i> 
                          <span>${post.numberOfLikes}</span>
                          <i class="fas fa-comments ms-3 comment-button" data-post-id="${
                            post.postID
                          }"></i> 
                          <span>${post.numberOfComments}</span>
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

  function getRelativeTime(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (years > 0) {
      return rtf.format(-years, "year");
    } else if (months > 0) {
      return rtf.format(-months, "month");
    } else if (days > 0) {
      return rtf.format(-days, "day");
    } else if (hours > 0) {
      return rtf.format(-hours, "hour");
    } else if (minutes > 0) {
      return rtf.format(-minutes, "minute");
    } else {
      return rtf.format(-seconds, "second");
    }
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
<div class="comment mb-4">
  <strong>${comment.authorName}</strong>
  <span class="badge" style="background-color: ${posterTypeColor}; color: black;">${
            comment.posterType
          }</span>
  <p style="margin-bottom:0px">${comment.comment}</p>
<small class="text-muted">
  ${getRelativeTime(new Date(comment.createdAt))}
</small>
</div>
`;
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

    const categoryID = $(this).data("category-id");

    // If "All" is selected, pass null to load all posts
    activeFilterCategoryID = categoryID === "all" ? null : categoryID;

    loadPosts(activeFilterCategoryID, $("#searchBar").val().toLowerCase()); // Filter posts based on active filter and search query
    loadMeetUpEvents(activeFilterCategoryID); // Apply filter to meet-up events as well
  });

  // Event listener for search bar
  $("#searchBar").on("input", function () {
    const searchQuery = $(this).val().toLowerCase();
    loadPosts(activeFilterCategoryID, searchQuery); // Search within the active filter
  });

  // Initial loading of filters and posts
  loadFilters();

  // Load categories into the create post modal
  function loadCategories() {
    $.ajax({
      url: `${API_URL}/categories`,
      method: "GET",
      success: function (categories) {
        const categoryDropdown = $("#postCategory");
        categoryDropdown.empty();
        categories.forEach((category) => {
          categoryDropdown.append(
            `<option value="${category.categoryID}">${category.categoryName}</option>`
          );
        });
      },
      error: function (err) {
        console.error("Error loading categories:", err);
      },
    });
  }

  $(document).ready(function () {
    const createPostButton = $("#createPostForm button[type='submit']");

    function validateForm() {
      const title = $("#postTitle").val().trim();
      const content = $("#postContent").val().trim();
      const category = $("#postCategory").val();
      const posterType = $("#posterType").val();

      // Enable the button only if all fields are filled
      if (title && content && category && posterType) {
        createPostButton.prop("disabled", false);
      } else {
        createPostButton.prop("disabled", true);
      }
    }

    // Attach input and change listeners to form fields
    $("#postTitle, #postContent, #postCategory").on(
      "input change",
      validateForm
    );

    $(".set-poster-type-pill").on("click", function () {
      $(".set-poster-type-pill").removeClass("active");
      $(this).addClass("active");
      $("#posterType").val($(this).data("poster-type"));
      validateForm();
    });

    // Disable the button by default
    createPostButton.prop("disabled", true);
  });

  // Handle create post form submission
  $("#createPostForm").on("submit", function (e) {
    e.preventDefault();

    const title = $("#postTitle").val().trim();
    const content = $("#postContent").val().trim();
    const categoryID = $("#postCategory").val();
    const posterType = $("#posterType").val();

    if (!posterType) {
      alert("Please select 'Post As' before submitting your post.");
      return;
    }

    $.ajax({
      url: `${API_URL}/create-post`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        title: title,
        content: content,
        categoryID: categoryID,
        posterType: posterType,
        memberID: userID,
      }),
      success: function () {
        $("#createPostModal").modal("hide");
        $("#createPostForm")[0].reset();
        selectedPosterType = null; // Reset selection
        $(".set-poster-type-pill").removeClass("active");
        loadPosts(); // Reload posts after creating a new post
      },
      error: function (err) {
        console.error("Error creating post:", err);
      },
    });
  });

  // Function to delete a post
  function deletePost(postID) {
    $.ajax({
      url: `${API_URL}/delete-post/${postID}`,
      method: "DELETE",
      success: function () {
        loadPosts(activeFilterCategoryID); // Reload posts after deleting
      },
      error: function (err) {
        console.error("Error deleting post:", err);
      },
    });
  }

  // Function to edit a post
  function editPost(postID) {
    const postCard = $(`.post-card[data-post-id="${postID}"]`);
    const title = postCard.find(".card-title").text().trim();
    const content = postCard.find(".card-content-text").text().trim();

    $("#postTitle").val(title);
    $("#postContent").val(content);
    $("#postCategory").find(".post-category").text().trim(); // Assuming category is tracked in post data
    $("#posterType").find(".post-posterType").text().trim(); // Assuming poster type is tracked in post data

    // Handle form submission for edit
    $("#createPostForm")
      .off("submit")
      .on("submit", function (e) {
        e.preventDefault();

        const updatedTitle = $("#postTitle").val().trim();
        const updatedContent = $("#postContent").val().trim();
        const categoryID = $("#postCategory").val();
        console.log(categoryID);
        const posterType = $("#posterType").val();

        $.ajax({
          url: `${API_URL}/edit-post`,
          method: "PUT",
          contentType: "application/json",
          data: JSON.stringify({
            postID: postID,
            title: updatedTitle,
            content: updatedContent,
            categoryID: categoryID,
            posterType: posterType,
            memberID: userID,
          }),
          success: function () {
            $("#createPostModal").modal("hide");
            loadPosts(activeFilterCategoryID); // Reload posts after editing
          },
          error: function (err) {
            console.error("Error editing post:", err);
          },
        });
      });

    // Open modal for editing post
    $("#createPostModal").modal("show");
  }

  // Event listener for edit button
  $("#postsContainer").on("click", ".edit-button", function () {
    const postID = $(this).data("post-id");
    editPost(postID);
  });

  // Event listener for delete button
  $("#postsContainer").on("click", ".delete-button", function () {
    const postID = $(this).data("post-id");
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(postID);
    }
  });

  // Initial load
  loadCategories();
  loadMeetUpEvents();
  loadPosts();
});
