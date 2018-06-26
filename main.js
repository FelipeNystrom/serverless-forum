const showInputSection = document.querySelector('#showInputSection');
const inputSection = document.querySelector('#inputSection');
const form = document.querySelector('#form');
const deckOfPosts = document.querySelector('#deckOfPosts');

// Data variables
let posts = [
  {
    title: 'hej hej',
    text: 'Det här är en post',
    author: '',
    comments: Array(0),
    id: 0
  }
];

let _postId = 0;

// FUNCTIONS

// ======== CREATE POST FUNCTIONS ========

// makes a object from new post input form and pushes that object to array posts
const pushPost = (titleInput, textInput, authorInput, arr) => {
  let post = {
    title: titleInput,
    text: textInput,
    author: authorInput,
    comments: []
  };

  // generate post id

  post.id = arr.length;

  posts.push(post);
  generatePost(post);
};

// generate post

const generatePost = (post = null) => {
  // html structure for new post
  for (post of posts) {
    let newPost = `<div id="${post.id}" class="post">
                    <div class="post-body">
                        <div class="post-title"><h3>${post.title}</h3></div>
                        <div class="post-text"><p>${post.text}</p> 
                        <em><p> - ${post.author}</p></em>
                        </div>
                        <div class="post-footer">
                          <div class="comments-control">
                          <div><button class="btn-new-comment">New comment</button></div>
                            <div><button class="btn-show-comments">Show comment</button></div>
                          </div>
                          <div class="post-admin">
                            <p>
                              <a href="#inputSection"><i class="update fas fa-edit"></i></a>
                            </p>
                            <p>
                              <i class="delete far fa-trash-alt"></i>
                            </p>
                          </div>
                        </div>
                        <div class="commentsSection">
                        <h3 id="commentSectionTitle"></h3>
                        <ul class="comments-list" id="commentsOnPost-${
                          post.id
                        }"></ul>
                        <form id="commentForm" class="comment-input"></form>
                        </div>
                      </div>
                    </div>`;

    // prevent loop to inject same post more than once
    if (post.id === _postId) {
      deckOfPosts.insertAdjacentHTML('beforeend', newPost);
      _postId++;
    } else if (_postId === post.id) {
      deckOfPosts.insertAdjacentHTML('beforeend', newPost);
      _postId++;
    }
  }
};

// ======== UPDATE POST FUNCTIONS ========

// fetch post object with id

const getPost = postId => {
  // convert post id to number
  let idNumber = parseInt(postId);
  for (post of posts) {
    // find post in posts array
    if (post.id === idNumber) {
      // returns post object
      return post;
    }
  }
};

// Show form with value from fetched object

const updatePost = postObj => {
  // form html + post value
  const updatePostForm = `
  <input type="hidden" id="postId" value="${postObj.id}">
  <input type="text" id="formTitle" value="${postObj.title}">
  <textarea id="formText" cols="30" rows="10">${postObj.text}</textarea>
  <div id="formAuthorInfo">
      <input type="text" id="formAuthor" value="${postObj.author}">
      <input type="text" id="formAuthorImg" value="${postObj.img}">
  </div>
  <input class="btn-submit update-post" type="submit" value="update post">`;

  // insert post value + update form
  form.insertAdjacentHTML('afterbegin', updatePostForm);

  // show section
  inputSection.style.display = 'block';
};

// ======== REMOVE POST FUNCTION ========

// delete post through id

const removePost = postToRemove => {
  let removePostId = parseInt(postToRemove.id);
  deckOfPosts.removeChild(postToRemove);
  posts = posts.filter(postID => postID === removePostId);
};

// ======== COMMENTS ========

const generateCommentForm = (whereToAttachForm, postId) => {
  // html form to be inserted when new post is clicked
  const newCommentForm = `
    <input type="hidden" id="postId" value="${postId}">
    <div class="comment-form-input-row">
        <input type="text" class="comment-title" id="commentTitle" placeholder="comment title">
        <input class="comment-author" type="text" id="commentAuthor" placeholder="author name">
    </div>
    <textarea class="comment-text" id="commentText" cols="2" rows="10" placeholder="write your comment"></textarea>
    <input class="btn-comment-submit" type="submit" value="Leave comment">`;

  // form insertion
  whereToAttachForm.insertAdjacentHTML('afterbegin', newCommentForm);
};

// push comment to posts[].comments
const pushComment = (commentTitle, commentAuthor, commentText, postId) => {
  // gets post with id
  let post = getPost(postId);

  let id = post.comments.length;
  // create comment object
  const commentObj = {
    id: id,
    title: commentTitle,
    text: commentText,
    author: commentAuthor
  };

  // pushes comment object to comments array
  let commentArr = post.comments;
  commentArr.push(commentObj);
};

// Generate comments from posts[].comments
const populateComments = (postId, placeToPopulate) => {
  let comments = getPost(postId).comments;

  // Generate comment element structure
  for (comment of comments) {
    let commentTemplate = `<li>
      <div class="comment-body">
        <div class="comment-body-title"><h4>${comment.title}</h4></div>
        <div class="comment-body-text">${comment.text}</div>
        <div class="comment-body-author"> - ${comment.author}</div>
      </div>
    </li>`;
    // insert comment to DOM
    placeToPopulate.insertAdjacentHTML('beforeend', commentTemplate);
  }
};

// ======== EVENT LISTENERS ========

// generates create post form and shows input section

showInputSection.addEventListener('click', e => {
  // html code to be injected on event
  const createPostForm = `
  <input type="text" id="formTitle" placeholder="title">
  <textarea id="formText" cols="30" rows="10" placeholder="post text"></textarea>
  <div id="formAuthorInfo">
      <input type="text" id="formAuthor" placeholder="name of author">
      <input type="text" id="formAuthorImg" placeholder="author image">
  </div>
  <input class="btn-submit new-post" type="submit" value="make new post">`;

  showInputSection.disabled = true;
  showInputSection.classList.remove('btn-show');
  showInputSection.classList.add('btn-disabled');

  // inject create post form on site
  form.insertAdjacentHTML('beforeend', createPostForm);

  // show form section
  inputSection.style.display = 'block';
});

// submit form listener

form.addEventListener('submit', e => {
  e.preventDefault();

  // fetch values from inputs
  let formTitle = document.querySelector('#formTitle').value;
  let formText = document.querySelector('#formText').value;
  let formAuthor = document.querySelector('#formAuthor').value;
  let formAuthorImg = document.querySelector('#formAuthorImg').value;
  // check which form is presented
  if (e.target[4].className === 'btn-submit new-post') {
    // create object to push to arrary
    pushPost(formTitle, formText, formAuthor, posts);
  } else if (e.target[5].className === 'btn-submit update-post') {
    // take post id and fetch object from array
    let postId = document.querySelector('#postId').value;
    let oldPost = getPost(postId);

    // assign new values to postobject
    oldPost.title = formTitle;
    oldPost.text = formText;
    oldPost.author = formAuthor;
    oldPost.img = formAuthorImg;

    // reset post counter
    _postId = 0;

    // remove posts from DOM
    deckOfPosts.innerHTML = '';

    // re-generate posts in array to DOM
    generatePost();

    // enable create post button
    showInputSection.disabled = false;
    showInputSection.classList.remove('btn-disabled');
    showInputSection.classList.add('btn-show');
  }

  // hides form section
  inputSection.style.display = 'none';

  // empty form section
  form.innerHTML = '';

  // enable create post button
  showInputSection.disabled = false;
  showInputSection.classList.remove('btn-disabled');
  showInputSection.classList.add('btn-show');
});

// delegated listener on posts.

deckOfPosts.addEventListener('click', e => {
  // selects the write comment form
  let commentForm = document.querySelector('#commentForm');

  // Postelement
  let post;

  // Postobject from array
  let fetchedPost;

  // Selects ul for show hide butttons
  let commentUl;

  // Selects section for display & hide
  let commentsSection;

  // Switch statement to catch diffrent click scenarios

  switch (e.target.className) {
    // update post button
    case 'update fas fa-edit':
      // disable new post button and change it's style to class disabled
      showInputSection.disabled = true;
      showInputSection.classList.remove('btn-show');
      showInputSection.classList.add('btn-disabled');

      // selects whole post element
      post =
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode.id;

      // get post object from array
      fetchedPost = getPost(post);
      // generate update form and populate with post values from array
      updatePost(fetchedPost);

      break;

    // remove post button
    case 'delete far fa-trash-alt':
      post = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;

      removePost(post);

      if (posts.length === 0) {
        _postId = 0;
      }

      break;

    // create new comment on post
    case 'btn-new-comment':
      createPostButton = e.target;
      // disable new comment button during wrinting session
      createPostButton.disabled = true;
      createPostButton.classList.remove('btn-new-comment');
      createPostButton.classList.add('btn-comment-disabled');

      // clicked post top element
      post = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;

      // selects commentsSection to show new comment form
      commentsSection = post.childNodes[1].childNodes[7];

      // selects form div to poulate with form
      let createCommentForm = post.childNodes[1].childNodes[7].childNodes[5];

      // get post object from posts array
      fetchedPost = getPost(post.id);

      // generate and shows new post form
      generateCommentForm(createCommentForm, post.id);

      // Choose and set comment section title dynamically
      let commentSectionTitle = commentsSection.childNodes[1];
      commentSectionTitle.innerHTML = 'Comments';

      // show whole section
      commentsSection.style.display = 'block';

      console.log(commentForm);
      // when new comment is submited it is pushed to posts[].comments array and lastly removes the form
      commentForm.addEventListener('submit', e => {
        e.preventDefault();

        let postId = document.querySelector('#postId').value;
        let commentTitle = document.querySelector('#commentTitle').value;
        let commentAuthor = document.querySelector('#commentAuthor').value;
        let commentText = document.querySelector('#commentText').value;

        pushComment(commentTitle, commentAuthor, commentText, postId);

        commentForm.innerHTML = '';

        let ul = post.childNodes[1].childNodes[7].childNodes[3];
        ul.style.display = 'block';
        ul.innerHTML = '';
        populateComments(post.id, ul);

        showCommentButton =
          post.childNodes[1].childNodes[5].childNodes[1].childNodes[3]
            .childNodes[0];

        // change button text and class to hide
        showCommentButton.classList.remove('btn-show-comments');
        showCommentButton.classList.add('btn-hide-comments');
        showCommentButton.innerText = 'Hide comments';

        // re-enable create post button
        createPostButton.disabled = false;
        createPostButton.classList.remove('btn-comment-disabled');
        createPostButton.classList.add('btn-new-comment');
      });

      break;

    // show comments belonging to post
    case 'btn-show-comments':
      showCommentButton = e.target;
      // empty form before populating
      commentForm.innerHTML = '';

      // clicked post top element
      post = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;

      // selects ul for populate direction
      commentUl = post.childNodes[1].childNodes[7].childNodes[3];

      // selects and shows comments section
      commentsSection = post.childNodes[1].childNodes[7];
      commentsSection.style.display = 'block';

      populateComments(post.id, commentUl);
      // get post object from array
      fetchedPost = getPost(post.id);

      // change button text and class to hide
      showCommentButton.classList.remove('btn-show-comments');
      showCommentButton.classList.add('btn-hide-comments');
      showCommentButton.innerText = 'Hide comments';

      break;

    case 'btn-hide-comments':
      // Selects post top element and assign value to commentUl. Then change button back to show
      post = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      // selects commentsSection to show new comment form
      commentsSection = post.childNodes[1].childNodes[7];
      commentsSection.style.display = 'none';

      // change button text and class to show
      showCommentButton.classList.remove('btn-hide-comments');
      showCommentButton.classList.add('btn-show-comments');
      showCommentButton.innerText = 'Show comments';
  }
});

generatePost();
