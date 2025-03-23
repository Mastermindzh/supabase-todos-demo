BEGIN;

INSERT INTO todos.people (name, email, username) VALUES 
('Alice', 'alice@example.com', 'alice01'),
('Bob', 'bob@example.com', 'bobby'),
('Charlie', 'charlie@example.com', 'charlie_c'),
('David', 'david@example.com', 'davey_d'),
('Emma', 'emma@example.com', 'emma_star'),
('Frank', 'frank@example.com', 'frank_f'),
('Grace', 'grace@example.com', 'grace_g'),
('Hannah', 'hannah@example.com', 'hannah_b'),
('Ian', 'ian@example.com', 'ian_rock'),
('Jack', 'jack@example.com', 'jacky_j');

-- Insert categories
INSERT INTO todos.categories (name) VALUES 
('Work'), ('Personal'), ('Health'), ('Finance'), ('Education');

-- insert todos

INSERT INTO todos.todos (title, description, category_id) VALUES 
('Prepare quarterly report', 'Compile and analyze financial data for Q1', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Schedule team meeting', 'Set up a weekly team sync-up on projects', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Draft project proposal', 'Outline the scope and objectives for the new client', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Organize emails', 'Sort and archive old emails to improve workflow', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Submit expense report', 'Log all receipts for the monthly financial audit', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Pay credit card bill', 'Ensure payment is made before the due date', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Review investment portfolio', 'Analyze stocks and bonds for possible reallocation', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Set up a savings plan', 'Define monthly budget allocations for future goals', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Buy birthday gift', 'Find a suitable present for a friend’s birthday', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Plan weekend trip', 'Look for affordable destinations and book hotels', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Declutter the house', 'Organize and donate unused household items', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Call grandparents', 'Check in and catch up on family news', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Enroll in a programming course', 'Sign up for an online Python bootcamp', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Complete SQL tutorial', 'Go through advanced SQL queries and joins', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Attend webinar on AI', 'Join a discussion about future trends in AI', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Read a book on leadership', 'Study management strategies and case studies', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Go for a morning run', 'Jog at the park for 30 minutes', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Meal prep for the week', 'Cook and store healthy meals in advance', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Schedule doctor appointment', 'Book an annual health check-up', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Meditate for 10 minutes', 'Practice mindfulness and breathing exercises', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Backup important files', 'Save work documents to cloud storage', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Write a blog post', 'Share insights on industry trends and experiences', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Improve LinkedIn profile', 'Update experience and network with professionals', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Prepare for client meeting', 'Gather documents and data for the discussion', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Analyze monthly expenses', 'Review spending patterns and adjust budget', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Check credit score', 'Monitor financial health and loan eligibility', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Plan retirement savings', 'Review pension contributions and adjust strategy', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Set up automatic bill payments', 'Ensure essential bills are paid on time', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Host a dinner party', 'Invite friends and prepare a special meal', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Redecorate the living room', 'Choose new colors and rearrange furniture', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Start journaling', 'Write down thoughts and daily reflections', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Try a new hobby', 'Explore painting, photography, or another skill', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Enroll in a data science course', 'Improve skills with hands-on machine learning projects', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Watch a documentary', 'Learn about history or science through film', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Join a study group', 'Collaborate with others to prepare for exams', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Write a research paper', 'Explore a topic in-depth and compile findings', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Hit the gym', 'Complete a full-body workout session', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Drink more water', 'Stay hydrated with at least 8 glasses daily', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Get 8 hours of sleep', 'Maintain a healthy sleep schedule', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Try a new recipe', 'Cook a dish from a different cuisine', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Create a business plan', 'Outline a strategy for a potential startup', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Learn a new software tool', 'Master an industry-relevant application', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Attend a networking event', 'Connect with professionals in the industry', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Set career goals', 'Define a 5-year plan for professional growth', (SELECT id FROM todos.categories WHERE name = 'Work')),
('Review tax documents', 'Ensure accuracy before filing taxes', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Compare insurance plans', 'Find the best health or life insurance option', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Save for a vacation', 'Allocate funds for a dream trip', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Start an emergency fund', 'Set aside savings for unexpected situations', (SELECT id FROM todos.categories WHERE name = 'Finance')),
('Take a road trip', 'Explore a nearby town or countryside', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Write a letter to a friend', 'Reconnect with an old friend through mail', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Plan a surprise for a loved one', 'Make someone’s day special with a thoughtful gesture', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Adopt a pet', 'Consider fostering or adopting an animal in need', (SELECT id FROM todos.categories WHERE name = 'Personal')),
('Sign up for an online course', 'Expand knowledge in a new field', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Practice a foreign language', 'Improve fluency through daily lessons', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Build a personal website', 'Showcase projects and portfolio online', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Teach someone a new skill', 'Help a friend or family member learn something new', (SELECT id FROM todos.categories WHERE name = 'Education')),
('Do yoga', 'Stretch and relax with a guided session', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Take a walk in nature', 'Unplug and enjoy fresh air outdoors', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Cut down on sugar', 'Make healthier dietary choices', (SELECT id FROM todos.categories WHERE name = 'Health')),
('Schedule an eye exam', 'Check vision health and update prescriptions if needed', (SELECT id FROM todos.categories WHERE name = 'Health'));

-- assign to people
INSERT INTO todos.todo_assignees (todo_id, person_id)
SELECT 
    t.id, 
    p.id
FROM todos.todos t
JOIN todos.people p ON RANDOM() < 0.3  -- ~30% chance of assignment
ORDER BY RANDOM()
LIMIT 150;

COMMIT;
