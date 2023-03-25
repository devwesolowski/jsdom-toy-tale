const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".add-container");

//temp global id to pass through toy to be updated
let toyUpdateId = 99999999;

let addToy = false;
let url = "http://localhost:3000/toys";

//click add new toy to reveal form
document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //grabs toys and renders
  getToys();

  //submit button for add new toy submits data to server
  document.querySelector(".add-toy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addNewToy({
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0,
    });
  });

  //edit toy submit button submits data to server
  document.querySelector(".edit-toy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    updateToy(toyUpdateId, e.target.name.value, e.target.image.value);
  });
});

//calls api to grab array of toys, then runs through and has each one rendered
function getToys() {
  fetch(url)
    .then((res) => res.json())
    .then((toys) => toys.forEach((toy) => renderToy(toy)));

  // ##Can also use await, above is "under the hood"##
  // const response = await fetch(url);
  // const toys = await response.json();
  // toys.forEach((toy) => renderToy(toy));
}

//creates the structure and injects data for each toy
function renderToy(toy) {
  const toyCollectionContainer = document.getElementById("toy-collection");

  //Creates each toys container
  const toyCard = document.createElement("div");
  toyCard.className = "card";

  //Delete Toy Button
  const toyDelete = document.createElement("button");
  toyDelete.className = "delete-btn";
  toyDelete.innerText = "Delete Toy";
  toyDelete.onclick = () => {
    return confirm("Are you sure you would like to delete this toy?");
  };
  toyDelete.addEventListener("click", (e) => {
    deleteToy(toy.id);
  });

  //Edit Toy Button which opens edit form and saves currently editable toys id
  const toyEdit = document.createElement("button");
  const toyEditContainer = document.querySelector(".edit-container");
  const toyEditNameInput = document.getElementById("edit-name-input");
  const toyEditImageInput = document.getElementById("edit-image-input");
  let editToy = false;
  toyEdit.className = "edit-btn";
  toyEdit.innerText = "Edit Toy";
  toyEdit.addEventListener("click", (e) => {
    editToy = !editToy;
    if (editToy) {
      toyEditContainer.style.display = "block";
      toyEditNameInput.placeholder = toy.name;
      toyUpdateId = toy.id;
    } else {
      toyEditContainer.style.display = "none";
      toyUpdateId = 99999999;
    }
  });

  //Toy name
  const toyName = document.createElement("h2");
  toyName.innerText = toy.name;

  //Toy image
  const toyImage = document.createElement("img");
  toyImage.setAttribute("src", toy.image);
  toyImage.className = "toy-avatar";

  //Toy likes
  const toyLikesContainer = document.createElement("p");
  const toyLikeCount = document.createElement("span");
  toyLikeCount.className = "like-count";
  toyLikeCount.innerText = toy.likes;

  //Toy Like button, that increases likes of toy when pressed
  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.innerText = "Like <3";
  likeButton.addEventListener("click", (e) => {
    likeToy(toy.id, toy.likes);
  });

  toyCollectionContainer.append(toyCard);
  toyCard.append(
    toyDelete,
    toyEdit,
    toyName,
    toyImage,
    toyLikesContainer,
    likeButton
  );
  toyLikesContainer.appendChild(toyLikeCount);
  toyLikesContainer.append(" Likes");
}

// Function uses the toy brought in from the form via event listeners.
function addNewToy(toy) {
  let postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(toy),
  };
  fetch(url, postOptions);
}

function likeToy(toy, likes) {
  let patchOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      likes: likes + 1,
    }),
  };
  fetch(url + "/" + toy, patchOptions);
}

function deleteToy(toy) {
  let deleteOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      id: toy.id,
    }),
  };
  fetch(url + "/" + toy, deleteOptions);
}

function updateToy(toy, toyName, toyImage) {
  let patchOptions;
  //if no toyName is passed through, only update image. Else if no toyImage passed
  //through, only update name. Else update them both
  if (toyName === "") {
    patchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        image: toyImage,
      }),
    };
  } else if (toyImage === "") {
    patchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        name: toyName,
      }),
    };
  } else {
    patchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
      }),
    };
  }
  console.log(toy + " " + toyName + " " + toyImage);
  fetch(url + "/" + toy, patchOptions);
}
