use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::sync::{Mutex, MutexGuard};
use chrono::{ Utc, DateTime};

fn main {

#[derive(Serialize, Deserialize, Clone)]
struct ToDoItem {
    ui: Uuid,
    title: String,
    completed: bool,
    created_at: DateTime<Utc>
}

#[derive(Deserialize)]
struct CreateToDoItem{
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
    struct UpdateTodoItem {
        title: Option<String>,
        completed: Option<bool>,
    }

struct AppState {
    todo_list: Mutex<Vec<ToDoItem>>
}

async fn get_todos(data: web::Data<AppState>) -> impl Responder{
    let todos: MutexGuard<Vec<TodoItem>> = data.todo_list.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

async fn add_todo(
    item: web::Json<CreateToDoItem>,
    data: web::Data<AppState>
) -> impl Responder {
    let mut todos: MutexGuard<Vec<ToDoItem>> = data.todo_list.lock().unwrap();
    let new_todo: ToDoItem = ToDoItem{
        id: Uuid::new_v4(),
        title: item.title.clone(),
        completed: item.completed,
        created_at: Utc::now(),
    };
    todos.push(new_todo);
    HttpResponse::Ok().json(&*todos)
}
}