<template>
  <section class="content">
    <div class="todo-wrapper">
      <h1 class="todo-title">To Do App</h1>
      <form @keydown.enter.prevent>
        <h4 class="todo-subtitle">What's on your todo list?</h4>
        <input
          type="text"
          class="input-todo"
          v-bind:class="{ active: new_todo }"
          placeholder="Your new ToDo"
          v-model="new_todo"
          v-on:keyup.enter="addItem"
        />
        <div
          class="btn btn-add"
          v-bind:class="{ active: new_todo }"
          @click="addItem"
        >
          +
        </div>
      </form>

      <div v-if="pending.length > 0">
        <p class="status busy">
          You have {{ pending.length }} pending task<span
            v-if="todoList.length > 1"
            >s</span
          >
        </p>
        <transition-group name="todo-item" tag="ul" class="todo-list">
          <Tarea
            v-for="item in pending"
            v-bind:key="item.title"
            v-bind:item="item"
            v-on:delete="deleteItem($event)"
          ></Tarea>
        </transition-group>
      </div>
      <transition name="slide-fade">
        <p class="status free" v-if="!pending.length">
          Time to celebrate, you have no pending tasks
        </p>
      </transition>

      <transition-group name="slide-down">
        <div v-if="completed.length > 0 && showComplete">
          <p class="status">Completed Tasks: {{ completedPercentage }}</p>
          <transition-group
            name="todo-item"
            tag="ul"
            class="todo-list archived"
          >
            <Tarea
              v-for="item in completed"
              v-bind:key="item.title"
              v-bind:item="item"
              v-on:delete="deleteItem($event)"
            ></Tarea>
          </transition-group>
        </div>
      </transition-group>

      <div class="control-buttons">
        <div
          class="btn btn-secondary"
          v-if="completed.length > 0"
          @click="toggleShowComplete"
        >
          <span v-if="!showComplete">Show</span>
          <span v-else>Hide</span> Completed
        </div>
        <div
          class="btn btn-secondary"
          v-if="todoList.length > 0"
          @click="clearAll"
        >
          Remove All
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Tarea from "./components/Tarea.vue";

export default {
  name: "toDo",
  data() {
    return {
      todoList: [],
      new_todo: "",
      showComplete: false,
    };
  },
  mounted: function () {
    this.todoList = JSON.parse(localStorage.getItem("todos")) || [];
  },
  beforeUpdate: function () {
    localStorage.setItem("todos", JSON.stringify(this.todoList));
  },
  components: {
    Tarea,
  },
  computed: {
    pending: function () {
      return this.todoList.filter(function (item) {
        return !item.done;
      });
    },
    completed: function () {
      return this.todoList.filter(function (item) {
        return item.done;
      });
    },
    completedPercentage: function () {
      return (
        Math.floor((this.completed.length / this.todoList.length) * 100) + "%"
      );
    },
  },
  methods: {
    toggleShowComplete() {
      this.showComplete = !this.showComplete;
    },
    addItem() {
      if (this.new_todo.trim() === "") {
        return;
      }
      this.todoList.unshift({
        id: this.todoList.length,
        title: this.new_todo,
        done: false,
      });
      this.new_todo = "";
      return true;
    },
    deleteItem(item) {
      this.todoList.splice(this.todoList.indexOf(item), 1);
    },
    clearAll() {
      this.todoList = [];
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-size: 15px;
  font-family: "Open Sans", sans-serif;
  color: #444;
  background-color: #fefefe;
  background-image: linear-gradient(#141c20 0%, #495ace 100%);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
}

.content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.todo-wrapper {
  width: 400px;
  max-width: 100%;
  min-height: 500px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 40px 20px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  background-color: #f4f7fc;
  overflow: hidden;
  position: relative;
}

.todo-title {
  font-size: 1.2em;
  color: #495ace;
  font-weight: normal;
}

.todo-subtitle {
  font-size: 12px;
  margin-top: 0.2px;
  margin-bottom: 0.2px;
  color: rgba(43, 43, 43, 0.681);
}

form {
  overflow: overlay;
}

form label {
  display: block;
  text-align: center;
  font-size: 1.2em;
}

.btn,
input {
  line-height: 2em;
  border-radius: 3px;
  border: 0;
  display: inline-block;
  margin: 15px 0;
  padding: 0.2em 1em;
  font-size: 1em;
}

input[type="text"] {
  border: 1px solid #ddd;
  min-width: 80%;
  transition: all ease-in 0.25s;
}

input:focus {
  outline: none;
  border: 1px solid #a3b1ff;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.3);
  font-style: italic;
}

.btn {
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  border-width: 1px;
  border-style: solid;
}

.btn-add {
  background: #ddd;
  color: #fefefe;
  border-color: #ddd;
  min-width: 17%;
  pointer-events: none;
  transition: all ease-in 0.25s;
  font-size: 2.2em;
  line-height: 0.5em;
  padding: 0.3em 0.3em;
  float: right;
}

.btn-add.active {
  background: #6664ff;
  border-color: #6664ff;
  pointer-events: visible;
}

.btn-add.active:hover {
  background: #4442f6;
  border-color: #4442f6;
}

.btn-add:active {
  transform: scale(0.95);
}
.control-buttons {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
}
.btn-secondary {
  display: inline-block;
  position: relative;
  border: 0;
  padding: 0;
  margin: 0 10px;
}

.btn-secondary:after {
  position: absolute;
  content: "";
  width: 0;
  height: 3px;
  background-color: #495ace;
  bottom: 0px;
  left: 0;
  transition: all ease-in 0.25s;
}

.btn-secondary:hover:after {
  width: 100%;
}

ul.todo-list {
  padding: 0;
  margin-bottom: 30px;
}

ul.todo-list li {
  position: relative;
  list-style-type: none;
  display: block;
  margin: 10px 0;
  background: #e0e8f5;
  border-radius: 3px;
  padding-left: 38px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 49px;
  overflow: hidden;
}

ul.todo-list.archived li {
  background: #fff;
}

.todo-text {
  position: relative;
  display: inline-block;
  padding: 0 0.5em;
}

.todo-checkbox {
  position: absolute;
  opacity: 0;
  display: none;
}

.todo-checkbox + label {
  position: absolute;
  cursor: pointer;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 2px;
  border: 1px solid #cfdcec;
  background-color: #fff;
}

.todo-checkbox:checked + label:after {
  position: absolute;
  content: "";
  top: 30%;
  left: 50%;
  height: 3px;
  width: 6px;
  border: solid #495ace;
  border-width: 0 0 2px 2px;
  transform-origin: center center;
  transform: rotate(-45deg) translate(-50%, -50%);
}

.todo-checkbox:checked + label:after {
  display: block;
}

.todo-checkbox:checked ~ .todo-text {
  color: #888;
  text-decoration: line-through;
}

.status.free {
  font-weight: bold;
  text-align: center;
  margin: 40px 0;
}
.status.free img {
  display: block;
  width: 50px;
  margin: 10px auto;
}

.todo-item-enter-active,
.todo-item-leave-active {
  transition: opacity ease 0.25s, transform ease-in-out 0.3s;
}

.todo-item-enter-from,
.todo-item-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all ease 0.3s;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translatey(100%);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: scale(1.1);
  opacity: 0;
}

footer {
  position: absolute;
  width: 100%;
  text-align: center;
  color: #fff;
  bottom: 20px;
  left: 0;
}

footer a {
  color: #fff;
}

@media screen and (min-width: 1024px) {
  ul.todo-list li .delete {
    position: absolute;
    height: 100%;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    cursor: pointer;
    opacity: 0;
    width: 0;
    background-color: #f33e44;
    color: #fff;
    transition: all ease-in 0.25s;
  }

  ul.todo-list li .delete:after {
    position: absolute;
    content: "";
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    background-image: url("./assets/trash.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transform: translate(-50%, -50%) scale(0.5);
    transition: all ease-in 0.25s;
  }

  ul.todo-list li:hover .delete {
    width: 44px;
    opacity: 1;
  }

  ul.todo-list li:hover .delete:after {
    transform: translate(-50%, -50%) scale(1);
  }
}

@media screen and (min-width: 767px) and (max-width: 1023px) {
  body {
    font-size: 12px;
  }

  .todo-wrapper {
    width: 30rem;
    min-height: 590px;
    padding: 40px 20px;
  }

  ul.todo-list li .delete {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-color: #f33e44;
    color: #ffffff;
    width: 25px;
    height: 25px;
    right: 2%;
    border-radius: 50%;
  }

  ul.todo-list li .delete:after {
    position: absolute;
    content: "";
    width: 16px;
    height: 16px;
    top: 4.2px;
    left: 4.9px;
    background-image: url("./assets/trash.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

@media screen and (max-width: 767px) {
  body {
    font-size: 10px;
  }

  .todo-wrapper {
    width: 20rem;
    min-height: 615px;
    padding: 40px 20px;
  }

  input[type="text"] {
    width: 50px;
  }

  ul.todo-list li .delete {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-color: #f33e44;
    color: #ffffff;
    width: 25px;
    height: 25px;
    right: 2%;
    border-radius: 50%;
  }

  ul.todo-list li .delete:after {
    position: absolute;
    content: "";
    width: 16px;
    height: 16px;
    top: 4.2px;
    left: 4.9px;
    background-image: url("./assets/trash.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}

@media screen and (max-width: 350px) {
  .todo-wrapper {
    width: 18rem;
    min-height: 615px;
    padding: 40px 20px;
  }
}

@media screen and (max-width: 320px) {
  body{
    height: 110vh;
  }

  .todo-wrapper {
    width: 15rem;
    min-height: 615px;
    padding: 40px 20px;
  }
}
</style>
