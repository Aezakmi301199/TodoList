import './css/style.css'
import {Taskk} from './task'
console.log('Пиздец какой-то');

// * Переменные
const add_task = document.getElementById('add_task'); const deskription_task = document.getElementById('deskription-task');
const list_task = document.querySelector('.list-task'); const name_task = document.getElementById('name-task');
const completeDay = document.getElementById('completeDay'); const completeTime = document.getElementById('completeTime');
const task_worker = document.getElementById('task_worker'); const user_chief = document.getElementById('user_chief');
const task_priority = document.getElementById('task_priority'); const task_status = document.getElementById('task_status');
let tasks;
let task_items = []; 
// 1)name_task.value,2)deskription_task.value, 3) completeDay.value, 4)completeTime.value, 5)task_priority.value, 6)worker.value,7)user_chief.value

// * Занесение данных в хранилище и реагирование кнопок(Добавление)
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks')) 
function Task(name,deskription,completeDay,completeTime,priority,status,worker,chief,createTime){
    if (createTime){
        this.createTime = createTime
    }
    else {
        this.createTime = new Date().toLocaleString();
    }
    this.name = name;                   
    this.deskription = deskription;
    this.aim = false;
    this.completeDay = completeDay.split('-').reverse().join('.'); // 31-03-2033
    this.completeTime = completeTime;
    this.completeDate = `${this.completeDay}, ${completeTime}:00`
    this.changeTimeUpload =new Date().toLocaleString();;
    this.priority = priority;
    this.worker = worker;
    this.chief = chief;
    this.status = status;
// 30.11.1999
}


const createTemplateTask = (task,index) => {
    return `
    <li data-sort = '${task.changeTimeUpload}' class='item-task ${task.aim || task.status == 'Выполнена' ? 'checked' : ''}'>
                    <div class='row'>
                    <h2>Задача №${index+1}</h2>
                    <h2 class='${task.aim || task.status == 'Выполнена' ? '' : 'red'}'>${task.name}</h2>
                    <div class='buttons'>
                        <input onclick='completeTask(${index})' type='checkbox' class='button-mini-delete btn-complete' ${(task.aim || task.status == 'Выполнена') ? 'checked' : ''}>
                        <div class='colTop'>
                        <button onclick='changeTask(${index})' class='button-mini-change'>Изменить задачу</button>
                        <button onclick='deleteTask(${index})' class='button-mini-delete'>Удалить</button>
                        </div>
                    </div>
                    </div>
                    <div class='row-center'>
                    <h3>Описание задачи: ${task.deskription}</h3>
                    </div>
                    <div class='to33perbasis'>
                    <div class=''>
                    <h4>Дата начала ${task.createTime}</h4>
                    <h4>Дата Окончания ${task.completeDate}</h4>
                    <h4>Дата Изменения ${task.changeTimeUpload}</h4>
                    </div>
                    <div class=''>
                    <h4>Работник : ${task.worker}</h4>
                    <h4>Руководитель : ${task.chief}</h4>
                    </div>
                    <div class=''>
                    <h4>Приоритет задачи : ${task.priority}</h4>
                    <h4>Статус задачи : ${task.status}</h4>
                    </div>
                    </div>
                </li>
    `


}
const filterTask = () =>{
    const activeTask = tasks.filter( item => item.aim == false)
    const completedTask = tasks.filter( item => item.aim == true) 
    for (let task in completedTask){
        completedTask[task].status = 'Выполнена'
    }
    tasks = [...activeTask,...completedTask];
}
const fillHtmlList = () => {
  list_task.innerHTML = '';
  if (tasks.length > 0){
    filterTask();
      tasks.forEach((item,index) => {
        list_task.innerHTML += createTemplateTask(item,index);
      });
      task_items = document.querySelectorAll('.item-task')
  }  
}

fillHtmlList();

const addToLocal = () =>{
    localStorage.setItem('tasks',JSON.stringify(tasks))
}

const completeTask = index =>{
    tasks[index].aim = !tasks[index].aim;
    if (tasks[index].aim) {
        task_items[index].classList.add('checked')
    } else {
        task_items[index].classList.remove('checked')
    }
    addToLocal();
    fillHtmlList();
}

add_task.addEventListener('click',function(action){
        tasks.push(new Task(
            name_task.value = name_task.value == '' ? 'Задача без заголовка' : name_task.value,
            deskription_task.value = deskription_task.value == '' ? 'Описание отсутствует' : deskription_task.value,
            completeDay.value = completeDay.value == '' ? '2100-11-30' : completeDay.value,
            completeTime.value = completeTime.value == '' ? '23:59' : completeTime.value,
            task_priority.value = task_priority.value == '' ? 'Высокий' : task_priority.value,
            task_status.value,
            task_worker.value = task_worker.value == '' ? 'Неизвествен' : task_worker.value,
            user_chief.value = user_chief.value == '' ? 'Незивестен' : user_chief.value )) // name,deskription,date,dateTime,priority,worker,chief
        addToLocal(); 
        fillHtmlList();
        deskription_task.value = ''; name_task.value = '';
        completeDay.value = '';      completeTime.value = '';
        task_worker.value = '';      user_chief.value  = '';
})
/*
if (deskription_task){
    deskription_task.addEventListener('keydown',function(action){
        if (action.key == 'Enter'){
            tasks.push(new Task(deskription_task.value))
            addToLocal();
            fillHtmlList()
            deskription_task.value = ''; name_task.value = '';
            completeDay.value = '';      completeTime.value = '';
            task_worker.value = '';      user_chief.value  = '';
            console.log('Кнопка работает')
        }
    })
}
*/
const deleteTask = (index) => {
    task_items[index].classList.add('deleteAnimation');
    setTimeout(() => {
        tasks.splice(index,1);
        addToLocal();
        fillHtmlList();
    }, 400)
}
const changeTask = (index)=>{
    const modal = document.createElement('section');
    modal.classList.add('container');
    modal.classList.add('modal_task');
    modal.classList.add('modal-show');
    modal.insertAdjacentHTML('afterbegin',`
    <h1 class='margin-top-text-align'>Задача №${index+1}</h1>
    <div class="col">
            <input required id='name-task' type='text' value = '${tasks[index].name}'>
            <input required id='deskription-task' type='text' value = '${tasks[index].deskription}'>
            <button class = 'cyan noselect' id='change_Task'>Изменить задачу</button>
            <div class='input_form time-form'>
                <label for='completeDay'><h3>Дата завершения</h3></label>
                <input class='without_border' required id='completeDay' type='date' value = '${tasks[index].completeDay.split('.').reverse().join('-')}'>
            </div>
            <div class='input_form time-form'>
                <label for='completeTime'><h3>Время завершения</h3></label>
                <input class='without_border' required id='completeTime' type='time' value = '${tasks[index].completeTime}'>
            </div>
            <div class='input_form bg-purple'>
                <label for='task_worker'><h3>Сотрудник</h3></label>
                <input  class='without_border' required id='task_worker' type='text' value = '${tasks[index].worker}'>
            </div>
            <div class='input_form bg-purple'>
                <label for='user_chief'><h3>Руководитель</h3></label>
                <input class='without_border' required id='user_chief' type='text' value = ${tasks[index].chief}>
            </div>
            <div class='input_form bg-purple'>  
                <label for='task_priority'><h3>Приоритет задачи</h3></label>
                <select required name = 'priority' id='task_priority'}>
                    <option value="Высокий">Высокий</option>
                    <option value="Средний">Средний</option>
                    <option value="Низкий">Низкий</option>
                </select> 
            </div>
            <div class='input_form bg-purple'>
                <label for='task_status'><h3>Статус задачи</h3></label>
                <select required name = 'priority' id='task_status' >
                    <option value="К выполнению">К выполнению</option>
                    <option value="Выполняется">Выполняется</option>
                    <option value="Выполнена">Выполнена</option>
                    <option value="Отменена">Отменена</option>
                </select>
            </div>
            <button class="modal-close" id='close_modal_task' type="button">
            </button>
        </div>
    `)
    const close_modal_task = modal.querySelector('#close_modal_task');
    close_modal_task.addEventListener('click',function(){
        modal.remove()
    })
    const change_Task = modal.querySelector('#change_Task');
    change_Task.addEventListener('click',function(){
        // const task_priority = document.getElementById('task_priority');
         let name_task = modal.querySelector('#name-task');  let deskription_task = modal.querySelector('#deskription-task');
         let task_worker = modal.querySelector('#task_worker'); let user_chief = modal.querySelector('#user_chief');
         let task_priority = modal.querySelector('#task_priority'); let task_status = modal.querySelector('#task_status');
         let completeDay = modal.querySelector('#completeDay'); let completeTime = modal.querySelector('#completeTime');
         let createTime = tasks[index].createTime;
         tasks.splice(index,1)
        tasks.splice(index,0,(new Task(
            name_task.value = name_task.value == '' ? 'Задача без заголовка' : name_task.value,
            deskription_task.value = deskription_task.value == '' ? 'Описание отсутствует' : deskription_task.value,
            completeDay.value = completeDay.value == '' ? '2100-11-30' : completeDay.value,
            completeTime.value == '' ? '23:59' : completeTime.value,
            task_priority.value = task_priority.value,
            task_status.value,
            task_worker.value = task_worker.value,
            user_chief.value = user_chief.value,
            createTime = createTime
            )) //name,deskription,completeDay,completeTime,priority,status,worker,chief
)
    
        addToLocal();
        fillHtmlList();
})
        
   
    document.body.appendChild(modal)

}
var exampleModal = document.createElement('section')
var modal_task=document.querySelector('.modal_task');
var close_modal_task=document.querySelector('.close_modal_task');
var open_modal_task = document.getElementById('open_modal_task');
open_modal_task.addEventListener('click',function(evt){
	evt.preventDefault();
	modal_task.classList.add('modal-show');
})
close_modal_task.addEventListener('click',function(evt){
	evt.preventDefault();
	modal_task.classList.remove('modal-show');
})

/*Авторизация */
var loginlink=document.querySelector('.login-link');
var popup=document.querySelector('.modal-login');
var close=document.querySelector('.modal-close');
var login =popup.querySelector('[name=login]');
var password =popup.querySelector('[name=password]');
var form=popup.querySelector('form fieldset .btn-joib input[type=submit]');
var storagelogin='';
var isStorageSupport =true;
var close_login = document.querySelector('.close_login');
try {
 storagelogin=localStorage.getItem('login');
} catch(err){
	isStorageSupport=false;
}
loginlink.addEventListener('click',function(evt){
	evt.preventDefault();
	popup.classList.add('modal-show');
 	if (storagelogin){
		login.value=storagelogin;
		password.focus();
	}else{
		login.focus();
	}
	
})
close.addEventListener('click',function(evt){
	evt.preventDefault();
	popup.classList.remove('modal-show');
	popup.classList.remove('modal-error');
})
form.addEventListener('click',function(evt){
	if (!login.value || !password.value )
	{
		popup.classList.remove('modal-error');
		popup.offsetWidth=popup.offsetWidth;
		popup.classList.add('modal-error');

	} else{
		if (isStorageSupport){

			localStorage.setItem('login',login.value);
		}
	}
});
window.addEventListener('keydown',function(evt){
	if (evt.keyCode ===27){
		evt.preventDefault();
		if (popup.classList.contains('modal-show')){
			popup.classList.remove('modal-show');
			popup.classList.remove('modal-error');
		}
	}
})
close_login.addEventListener('click',function(evt){
	evt.preventDefault();
    popup.classList.remove('modal-show');
})
/*Регистрация */ 
var linkreg=document.querySelector('.reg-link');
var popupreg=document.querySelector('.modal-reg');
var closereg=document.querySelector('.close-reg');
linkreg.addEventListener('click',function(evt){
	evt.preventDefault();
	popupreg.classList.add('modal-show');
})
closereg.addEventListener('click',function(evt){
	evt.preventDefault();
	popupreg.classList.remove('modal-show');
})
//  Без группировок: список всех задач, отсортированных по дате / последнего обновления
let btn_sort_increasing=document.querySelector('#btn_sort_increasing');
let btn_sort_off_increasing=document.querySelector('#btn_sort_off_increasing');
btn_sort_increasing.addEventListener('click',function(event){
    event.preventDefault();
    btn_sort_increasing.style.background='#4442db';
    btn_sort_off_increasing.style.background='rgb(51, 26, 119)';
    let list_task=document.querySelector('#list-task');
    for (let i=0;i<list_task.children.length;i++){
        for (let j=i;j<list_task.children.length;j++){
            if (list_task.children[i].getAttribute('data-sort')>
            list_task.children[j].getAttribute('data-sort')){
        let replaceNode=list_task.replaceChild(list_task.children[j],list_task.children[i]);
        insertAfter(replaceNode,list_task.children[i]);
            }
        }
    }
    addToLocal()
  }
)
function insertAfter (el,refelement){
	return refelement.parentNode.insertBefore(el,refelement.nextSibling);
}
btn_sort_off_increasing.addEventListener('click',function(event){
    event.preventDefault();
    btn_sort_off_increasing.style.background='#4442db';
    btn_sort_increasing.style.background='rgb(51, 26, 119)';
    let list_task=document.querySelector('#list-task');
    for (let i=0;i<list_task.children.length;i++){
        for (let j=i;j<list_task.children.length;j++){
            if (list_task.children[i].getAttribute('data-sort')<
            list_task.children[j].getAttribute('data-sort')){
         let replaceNode=list_task.replaceChild(list_task.children[j],list_task.children[i]);
        insertAfter(replaceNode,list_task.children[i]);
            }
        }
    }
    addToLocal()
  }
)
/*

for (let indexTask in tasks){
    let DateAmerican = tasks[indexTask].completeDay.split('.').reverse().join('-');
    console.log(DateAmerican)
}
*/