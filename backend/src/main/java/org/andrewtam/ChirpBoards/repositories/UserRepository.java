package org.andrewtam.ChirpBoards.repositories;

import org.andrewtam.ChirpBoards.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}
