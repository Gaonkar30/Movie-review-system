package com.netflix.movieapi;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public class Review {
    @Id
    private ObjectId id;
    private String body;
    private String username;

    // Constructor with all arguments
    public Review(ObjectId id, String body, String username) {
        this.id = id;
        this.body = body;
        this.username = username;
    }

    // Constructor with body and username
    public Review(String body, String username) {
        this.body = body;
        this.username = username;
    }

    // No-argument constructor
    public Review() {
    }

    // Getters and setters
    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public ObjectId getId() {
        return id;
    }

    public String getIdString() {
        return id != null ? id.toString() : null;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
