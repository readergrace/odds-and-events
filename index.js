const state = {
  bank: [],
  odds: [],
  evens: [],
};

// Adds a number to the bank, then asks for a fresh render.
// Reject empty input and anything that is not a number.
function addNumber(value) {
  if (value.trim() === "" || Number.isNaN(Number(value))) return;
  state.bank.push(Number(value));
  render();
}

// Odd vs even. 0 is even. Negatives are odd because -3 % 2 is -1, not 0.
function moveOne(n) {
  if (n % 2 === 0) state.evens.push(n);
  else state.odds.push(n);
}

// Sort 1: take the first bank number and move it. shift() removes index 0.
function sortOne() {
  if (state.bank.length === 0) return;
  moveOne(state.bank.shift());
  render();
}

// Sort All: keep moving until the bank is empty, then render once.
function sortAll() {
  while (state.bank.length > 0) {
    moveOne(state.bank.shift());
  }
  render();
}

// Component: a row of numbers. Returns an element, does not mount it.
function NumberList(numbers) {
  const output = document.createElement("output");
  output.textContent = numbers.join(", ");
  return output;
}

// Component: the form. The listener changes state. It does not edit the DOM.
function Form() {
  const form = document.createElement("form");

  const label = document.createElement("label");
  label.textContent = "Add a number to the bank";

  const input = document.createElement("input");
  input.type = "number";
  input.name = "number";
  input.required = true;

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Add number";

  label.append(input);
  form.append(label, button);

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    addNumber(input.value);
    form.reset();
  });

  return form;
}

// Component: Sort 1 and Sort All. Clicks call state functions only.
function SortButtons() {
  const row = document.createElement("div");
  row.className = "actions";

  const sortOneButton = document.createElement("button");
  sortOneButton.type = "button";
  sortOneButton.textContent = "Sort 1";
  sortOneButton.addEventListener("click", sortOne);

  const sortAllButton = document.createElement("button");
  sortAllButton.type = "button";
  sortAllButton.textContent = "Sort All";
  sortAllButton.addEventListener("click", sortAll);

  row.append(sortOneButton, sortAllButton);
  return row;
}

// Component: a titled section for the bank, the odds, or the evens.
function Section(title, numbers) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  heading.textContent = title;
  section.append(heading, NumberList(numbers));
  return section;
}

// Component: the whole page, built from the current state.
function App() {
  const app = document.createElement("div");
  const title = document.createElement("h1");
  title.textContent = "Odds and Events";

  app.append(
    title,
    Form(),
    Section("Number bank", state.bank),
    SortButtons(),
    Section("Odds", state.odds),
    Section("Evens", state.evens),
  );
  return app;
}

// Re-render: throw away the old tree and draw a new one from state.
// Called only after state changes, and once on startup.
function render() {
  const root = document.querySelector("#app");
  root.replaceChildren(App());
}

render();
