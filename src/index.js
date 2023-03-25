console.log("Page reloaded " + Math.random());

const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".add-container");

let toyUpdateId = 99999999;
let toyUpdateName = "";
let toyUpdateImage = "";

let addToy = false;
let url = "http://localhost:3000/toys";

document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  getToys();

  document.querySelector(".add-toy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addNewToy({
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0,
    });
  });

  document.querySelector(".edit-toy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("EDIT TOY HIT");
    updateToy(toyUpdateId, e.target.name.value, e.target.image.value);
  });
});

function getToys() {
  fetch(url)
    .then((res) => res.json())
    .then((toys) => toys.forEach((toy) => renderToy(toy)));

  // ##Can also use await, above is "under the hood"##
  // const response = await fetch(url);
  // const toys = await response.json();
  // toys.forEach((toy) => renderToy(toy));
}

function renderToy(toy) {
  const toyCollectionContainer = document.getElementById("toy-collection");

  const toyCard = document.createElement("div");
  toyCard.className = "card";

  const toyDelete = document.createElement("button");
  toyDelete.className = "delete-btn";
  toyDelete.innerText = "Delete Toy";
  toyDelete.onclick = () => {
    return confirm("Are you sure you would like to delete this toy?");
  };
  toyDelete.addEventListener("click", (e) => {
    deleteToy(toy.id);
  });

  const toyEdit = document.createElement("button");
  const toyEditContainer = document.querySelector(".edit-container");
  const toyEditNameInput = document.getElementById("edit-name-input");
  const toyEditImageInput = document.getElementById("edit-image-input");
  let editToy = false;
  toyEdit.className = "edit-btn";
  toyEdit.innerText = "Edit Toy";
  // toyEdit.onclick = () => {
  //   return confirm("Are you sure you would like to delete this toy?");
  // };
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

  const toyName = document.createElement("h2");
  toyName.innerText = toy.name;

  const toyImage = document.createElement("img");
  toyImage.setAttribute("src", toy.image);
  toyImage.className = "toy-avatar";

  const toyLikesContainer = document.createElement("p");
  const toyLikeCount = document.createElement("span");
  toyLikeCount.className = "like-count";
  toyLikeCount.innerText = toy.likes;

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
  // {
  //   name: e.target.name.value,
  //   image: e.target.image.value,
  //   likes: 0,
  // }

  let patchOptions;
  if (toyName === "") {
    patchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        // name: toyName,
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
        // image: toyImage,
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
