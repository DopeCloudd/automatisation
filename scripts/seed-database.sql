-- Mettre à jour les utilisateurs existants avec des données Zoom
UPDATE user SET 
  zoomId = CASE 
    WHEN email = 'admin@company.com' THEN 'zoom_admin_123'
    WHEN email = 'john.doe@company.com' THEN 'zoom_john_456'
    WHEN email = 'jane.smith@company.com' THEN 'zoom_jane_789'
    ELSE NULL
  END,
  zoomRole = CASE 
    WHEN role = 'admin' THEN 'ADMIN'
    ELSE 'USER'
  END
WHERE email IN ('admin@company.com', 'john.doe@company.com', 'jane.smith@company.com');

-- Insérer des utilisateurs de test si ils n'existent pas
INSERT IGNORE INTO user (id, name, email, emailVerified, createdAt, updatedAt, role, zoomId, zoomRole) VALUES
('user_test_1', 'Admin Test', 'admin@test.com', true, NOW(), NOW(), 'admin', 'zoom_admin_test', 'ADMIN'),
('user_test_2', 'John Doe', 'john@test.com', true, NOW(), NOW(), 'user', 'zoom_john_test', 'USER'),
('user_test_3', 'Jane Smith', 'jane@test.com', true, NOW(), NOW(), 'user', 'zoom_jane_test', 'USER');

-- Insérer des réunions de test
INSERT INTO meeting (id, title, description, startTime, endTime, hostId, status) VALUES
('meeting_1', 'Réunion équipe marketing', 'Point hebdomadaire sur les campagnes en cours', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY + INTERVAL 1 HOUR), 'user_test_1', 'SCHEDULED'),
('meeting_2', 'Formation produit', 'Présentation des nouvelles fonctionnalités', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY + INTERVAL 90 MINUTE), 'user_test_2', 'SCHEDULED'),
('meeting_3', 'Rétrospective sprint', 'Bilan du sprint et planification', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + INTERVAL 90 MINUTE), 'user_test_3', 'SCHEDULED');

-- Insérer les participants aux réunions
INSERT INTO meeting_attendee (id, meetingId, userId, status) VALUES
('attendee_1', 'meeting_1', 'user_test_2', 'ACCEPTED'),
('attendee_2', 'meeting_1', 'user_test_3', 'INVITED'),
('attendee_3', 'meeting_2', 'user_test_1', 'ACCEPTED'),
('attendee_4', 'meeting_2', 'user_test_3', 'ACCEPTED'),
('attendee_5', 'meeting_3', 'user_test_1', 'ACCEPTED'),
('attendee_6', 'meeting_3', 'user_test_2', 'ACCEPTED');
