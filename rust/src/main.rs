use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::sync::Mutex;
use chrono::{ Utc,DateTime};


fn main {

#[derive(Serialize, Deserialize, Clone)]
    struct TodDoItem {
        ui: Uuid,
        title: String,
        completed: bool,
        created_at: DateTime<Utc>
    }
}