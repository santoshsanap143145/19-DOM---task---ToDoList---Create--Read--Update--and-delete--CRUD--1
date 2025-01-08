const cl = console.log;

const generateUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random = (Math.random() * 16) | 0; // Random number between 0 and 15
      const value = character === "x" ? random : (random & 0x3) | 0x8; // Adjust 'y' characters
      return value.toString(16); // Convert to hexadecimal
    }
  );
};

const todoArray = JSON.parse(localStorage.getItem("todoArray")) || [
  {
    todoItem: "HTML",
    todoId: generateUuid(),
  },
  {
    todoItem: "CSS",
    todoId: generateUuid(),
  },
  {
    todoItem: "Bootstrap3",
    todoId: generateUuid(),
  },
];

const todoList = document.getElementById("todoList");

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");

const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const editOnClick = (ele) => {
  let editId = ele.closest("li").id;
  localStorage.setItem("editId", editId);
  let getEditObj = todoArray.find((todo) => todo.todoId === editId);
  todoInput.value = getEditObj.todoItem;
  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
};

const removeOnClick = (ele) => {
  let removeId = ele.closest("li").id;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let getIndex = todoArray.findIndex((todo) => todo.todoId === removeId);
      todoArray.splice(getIndex, 1);
      localStorage.setItem("todoArray", JSON.stringify(todoArray));
      ele.closest("li").remove();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
};

const templatingTodoList = (array = todoArray) => {
  let result = "";
  array.forEach((todo) => {
    result += `
              <li class="list-group-item d-flex justify-content-between" id="${todo.todoId}">
                <strong>${todo.todoItem}</strong>
                <span>
                  <button class="btn btn-sm btn-outline-primary" onclick="editOnClick(this)">
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="removeOnClick(this)">
                    Remove
                  </button>
                </span>
              </li>
              `;
    todoList.innerHTML = result;
  });
};
templatingTodoList();

const submitFormOnClick = (eve) => {
  //prevent default behavior
  eve.preventDefault();
  // create new object
  let newObj = {
    todoItem: todoInput.value,
    todoId: generateUuid(),
  };
  todoForm.reset(); // reset the form
  // store the object in array and array in localStorage
  todoArray.push(newObj);
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
  // show the data on UI
  let newLi = document.createElement("li");
  newLi.className = "list-group-item d-flex justify-content-between";
  newLi.id = newObj.todoId;
  newLi.innerHTML = `
                <strong>${newObj.todoItem}</strong>
                <span>
                  <button class="btn btn-sm btn-outline-primary" onclick="editOnClick(this)">
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="removeOnClick(this)">
                    Remove
                  </button>
                </span>`;
  todoList.append(newLi);

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500,
  });
};

const onClickUpdateTodo = () => {
  let getUpdateId = localStorage.getItem("editId");
  let updatedObj = {
    todoItem: todoInput.value,
    todoId: getUpdateId,
  };
  todoForm.reset();
  let getIndex = todoArray.findIndex((todo) => todo.todoId === getUpdateId);
  todoArray[getIndex] = updatedObj;
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
  let updateLi = document.getElementById(getUpdateId);
  updateLi.children[0].innerHTML = updatedObj.todoItem;
  submitBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  todoForm.reset();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 1500,
  });
};

todoForm.addEventListener("submit", submitFormOnClick);
updateBtn.addEventListener("click", onClickUpdateTodo);
