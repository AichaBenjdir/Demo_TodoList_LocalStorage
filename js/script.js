let box = document.getElementById("box");
let addTaskBtn = document.getElementById("addTask");
let saveTaskBtn = document.getElementById("saveTask");
let taskTitleInput = document.getElementById("taskTitle");
let taskDescriptionInput = document.getElementById("taskDescription");
let taskDateInput = document.getElementById("taskDate");
let sortTaskBtn = document.getElementById("sortTask"); // Bouton "Trier les tâches"
let editIndex = null; // Variable pour suivre l'index de la tâche en cours d'édition

// Fonction de chargement des tâches
const load = () => {
    try {
        if (typeof Storage != undefined) {
            box.innerHTML = "";
            let list = localStorage.getItem("list");
            if (list !== null) {
                list = JSON.parse(list);
                if (list.data.length) {
                    list.data.forEach((task, index) => {
                        box.insertAdjacentHTML("beforeend",
                            `<tr>
                                <td>${index + 1}</td>
                                <td>${task.title}</td>
                                <td>${task.description}</td>
                                <td>${task.date}</td>
                                <td>
                                    <button class='btn btn-success' onclick="editform('${index}')">Editer</button>
                                    <button class='btn btn-danger' onclick="deletedata('${index}')">Supprimer</button>
                                </td>
                            </tr>`);
                    });
                } else {
                    box.innerHTML = "<tr><td colspan='5'>Aucun enregistrement trouvé</td></tr>";
                }
            } else {
                box.innerHTML = "<tr><td colspan='5'>Aucun enregistrement trouvé</td></tr>";
            }
        } else {
            alert("Votre navigateur ne supporte pas localStorage");
        }
    } catch (err) {
        alert(err);
    }
};
load();

// Fonction pour ajouter une tâche
addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let taskTitle = taskTitleInput.value.trim();
    let taskDescription = taskDescriptionInput.value.trim();
    let taskDate = taskDateInput.value.trim();

    if (taskTitle === "" || taskDescription === "" || taskDate === "") {
        alert("Veuillez remplir tous les champs");
        return;
    }

    let list = localStorage.getItem("list");
    list = list ? JSON.parse(list) : { data: [] };

    list.data.push({
        title: taskTitle,
        description: taskDescription,
        date: taskDate
    });

    localStorage.setItem("list", JSON.stringify(list));

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDateInput.value = "";

    load(); // Recharge la liste
});

// Fonction de suppression
const deletedata = (index) => {
    let list = localStorage.getItem("list");
    list = JSON.parse(list);
    list.data.splice(index, 1); // Supprimer la tâche
    localStorage.setItem("list", JSON.stringify(list));
    load();
};

// Fonction d'édition d'une tâche
const editform = (index) => {
    let list = JSON.parse(localStorage.getItem("list"));
    let task = list.data[index];

    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description;
    taskDateInput.value = task.date;

    editIndex = index;

    addTaskBtn.classList.add("d-none");
    saveTaskBtn.classList.remove("d-none");
    sortTaskBtn.classList.add("d-none");
};

// Fonction pour enregistrer la modification d'une tâche
saveTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let taskTitle = taskTitleInput.value.trim();
    let taskDescription = taskDescriptionInput.value.trim();
    let taskDate = taskDateInput.value.trim();

    if (taskTitle === "" || taskDescription === "" || taskDate === "") {
        alert("Veuillez remplir tous les champs");
        return;
    }

    let list = JSON.parse(localStorage.getItem("list"));

    list.data[editIndex] = {
        title: taskTitle,
        description: taskDescription,
        date: taskDate
    };

    localStorage.setItem("list", JSON.stringify(list));

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDateInput.value = "";

    load();

    editIndex = null;

    addTaskBtn.classList.remove("d-none");
    saveTaskBtn.classList.add("d-none");
    sortTaskBtn.classList.remove("d-none");
});

// Fonction pour trier les tâches par date
sortTaskBtn.addEventListener("click", () => {
    let list = JSON.parse(localStorage.getItem("list"));
    
    // Trier les tâches par date croissante
    list.data.sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateA - dateB; // Trier par ordre croissant
    });

    localStorage.setItem("list", JSON.stringify(list));
    load(); // Recharger la liste après le tri
});
