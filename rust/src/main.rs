use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::sync::{Mutex, MutexGuard};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
struct ToDoItem {
    ui: Uuid,
    title: String,
    completed: bool,
    created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
struct CreateToDoItem {
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
struct UpdateTodoItem {
    title: Option<String>,
    completed: Option<bool>,
}

struct AppState {
    todo_list: Mutex<Vec<ToDoItem>>,
}

async fn get_todos(data: web::Data<AppState>) -> impl Responder {
    let todos: MutexGuard<Vec<ToDoItem>> = data.todo_list.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

async fn add_todo(item: web::Json<CreateToDoItem>, data: web::Data<AppState>) -> impl Responder {
    let mut todos: MutexGuard<Vec<ToDoItem>> = data.todo_list.lock().unwrap();
    let new_todo = ToDoItem {
        ui: Uuid::new_v4(),
        title: item.title.clone(),
        completed: item.completed,
        created_at: Utc::now(),
    };
    todos.push(new_todo);
    HttpResponse::Ok().json(&*todos)
}

async fn update_todo(
    path: web::Path<Uuid>,
    item: web::Json<UpdateTodoItem>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut todos: MutexGuard<Vec<ToDoItem>>;
    data.todo_list.lock().unwrap();

    if let Some(todo) = todos
        .iter_mut()
        .find(|todo: &&mut ToDoItem| todo.id == *path)
    {
        if let Some(title) = &item.title {
            todo.title = title.clone();
        }
        if let Some(completed) = item.completed {
            todo.completed = completed
        }
        HttpResponse::Ok().json(&*todos)
    } else {
        HttpResponse::NotFound().body("Todo not found")
    }
}

async fn delete_todo(path: web::Path<Uuid>, data: web::Data<AppState>) -> impl Responder {
    let mut todos = data.todo_list.lock().unwrap();
    if todos.iter().any(|todo: &ToDoItem| todo.id == *path) {
        todos.retain(|todo: &ToDoItem| todo.id != *path);
        HttpResponse::Ok().json(&*todos)
    } else {
        HttpResponse::NotFound().body("Todo not found")
    }

#[active_web::main]
async fn main() -> std::io::Result<()>{
    let app_state = web::Data::new(AppState {
        todo_list: Mutex::new(Vex::new()),
    });

    HttpServer::new(move || {
        let cors = Cors::default()
        .allow_any_origin()
        .allow_any_method()
        .allow_any_header()
        .max_age(3600);

    App::new()
    .app_data(app_state.clone())
    .wrap(cors).route("/todos", web::get().to(get_todos))
    .route("/todos", web::post().to(add_todo))
    .route("todos/{id}", web::put().to(update_todo))
    .route("todos/{id}", web::delete().to(delete_todo))
    })

    
}
