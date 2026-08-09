# Connect & Grow

Build a complete, production-quality full-stack web application called ABTalks 2.0, an AI-powered community, learning, events and networking platform for students, developers, founders and technology enthusiasts.

I am a complete beginner, so do everything for me. Do not give me only a UI mockup. Build the actual working application with frontend, backend, database, authentication, APIs, responsive design, validation, loading states, error handling and realistic demo data.

1. CORE VISION

Reimagine ABTalks as a modern technology community platform where users can:

Discover technology events

Join hackathons

Attend workshops and talks

Discover learning resources

Create and share posts

Connect with other members

Build a professional profile

Track their events and learning activity

Get personalized recommendations

Interact with an AI assistant

The application should feel like a real startup product, not a college project.

Do NOT simply copy the existing ABTalks website. Create a completely new modern UX and information architecture inspired by the concept of ABTalks.

2. TECH STACK

Use:

React

TypeScript

Tailwind CSS

Modern component architecture

Supabase for:

Authentication

PostgreSQL database

Storage where necessary

Row Level Security

Use a suitable AI API integration for the AI features.

Make the architecture easy to understand and maintain.

Use reusable components throughout the application.

The application must work properly on:

Desktop

Laptop

Tablet

Mobile

3. DESIGN DIRECTION

Create a premium modern technology-platform aesthetic.

Design characteristics:

Clean

Minimal

Futuristic

Professional

Slightly experimental

Excellent typography

Smooth animations

Large visual hierarchy

Modern cards

Subtle gradients

Glassmorphism only where appropriate

Beautiful hover effects

Smooth page transitions

Excellent spacing

Strong visual hierarchy

Avoid making it look like a generic dashboard template.

Use a consistent design system for:

Colors

Typography

Buttons

Cards

Forms

Badges

Navigation

Modals

Alerts

Empty states

Use Lucide icons or another consistent icon library.

4. LANDING PAGE

Create a highly polished landing page.

Sections:

Hero

Headline:

"Where Ideas Meet Intelligence."

Subheadline:

"Discover people, events, knowledge and opportunities shaping the next generation of technology."

Primary CTA:

"Explore ABTalks"

Secondary CTA:

"Join the Community"

Hero should include an interactive visual representing the ABTalks community/network.

Featured Events

Show upcoming:

Hackathons

Workshops

Tech talks

Webinars

Meetups

Each event card should contain:

Event image

Event title

Category

Date

Location / Online

Organizer

Number of participants

Register button

Trending Topics

Display technology topics such as:

Artificial Intelligence

Web Development

Java

React

Cloud

Cybersecurity

Blockchain

Data Science

Clicking a topic should take users to related content.

Community Section

Show:

Active members

Trending discussions

Popular creators

Featured projects

AI Section

Introduce the platform's AI assistant.

Headline:

"Your AI-powered technology companion."

Explain that the assistant can:

Recommend events

Recommend learning resources

Help users find communities

Answer questions about ABTalks

Suggest what the user should learn next

CTA:

"Ask ABTalks AI"

Final CTA

"Your next opportunity could start here."

Buttons:

"Explore Community"

"Create Account"

5. NAVIGATION

Create a modern responsive navbar.

Desktop:

Logo: ABTalks

Home

Explore

Events

Community

Learn

AI Assistant

Right side:

Search

Notifications

Profile

If logged out:

Login

Join ABTalks

Mobile:

Use a clean mobile navigation menu.

6. AUTHENTICATION

Implement real authentication using Supabase.

Features:

Sign up

Login

Logout

Forgot password

Password reset

Persistent sessions

Protected routes

Signup fields:

Name

Username

Email

Password

Interests

After signup, show a short onboarding flow.

7. USER ONBOARDING

After registration, ask users to select interests.

Categories:

AI

Web Development

App Development

Java

Python

C++

React

Cloud

Cybersecurity

Blockchain

Data Science

UI/UX

Startups

Entrepreneurship

Then create a personalized home experience.

8. EXPLORE PAGE

Create a discovery page where users can discover:

Events

Communities

People

Projects

Articles

Learning resources

Add:

Search

Filters

Sorting

Categories

Filters should work.

Example:

Category:
AI / Web / Java / Cloud / etc.

Type:
Event / Person / Project / Resource

Sort:
Trending / Latest / Popular

9. EVENTS SYSTEM

Create a complete events system.

Users can:

Browse events

Search events

Filter events

View event details

Register for events

Bookmark events

Share events

Event detail page should contain:

Title

Banner

Description

Organizer

Date

Time

Location

Online/offline status

Speakers

Participants

Agenda

Requirements

Registration button

After registration, the event should appear in:

"My Events"

10. COMMUNITY

Build a real community feed.

Users can:

Create posts

Like posts

Comment

Reply to comments

Bookmark posts

Share posts

Follow users

Post types:

Discussion

Question

Project showcase

Achievement

Learning

Event

Create a clean social-feed experience, but keep it professional and technology-focused.

11. USER PROFILE

Create professional profiles.

Profile should contain:

Profile picture

Name

Username

Bio

Skills

Interests

Projects

Achievements

Events attended

Posts

Followers

Following

Allow users to edit their profile.

Add a "Connect" or "Follow" button.

12. LEARNING HUB

Create a learning section.

Users can discover resources grouped into:

Beginner

Intermediate

Advanced

Categories:

Programming

Web Development

AI

Cloud

Data Science

Cybersecurity

System Design

Interview Preparation

Each resource should contain:

Title

Description

Difficulty

Technology

Estimated time

Resource type

External resource link

Add a "Save" feature.

13. PERSONALIZED DASHBOARD

After login, create a personalized dashboard.

Show:

Welcome section

"Good morning, [name]"

Continue Learning

Show resources the user has saved or started.

Recommended Events

Recommend events based on interests.

Community Activity

Show relevant posts.

Your Progress

Display:

Events attended

Resources completed

Posts created

Connections

Recommended For You

Use the user's selected interests to personalize recommendations.

14. AI ASSISTANT

Create an actual AI assistant page.

Name:

"ABTalks AI"

Create a beautiful chat interface.

The assistant should help with:

Event discovery

Example:

"Find me upcoming AI events."

Learning recommendations

Example:

"I want to learn Spring Boot. What should I learn first?"

Career guidance

Example:

"I'm a second-year CSE student. What should I learn for software development?"

Community discovery

Example:

"Who should I follow if I'm interested in React?"

Platform navigation

Example:

"Where can I find hackathons?"

The AI UI should include:

Chat history

Suggested prompts

Loading animation

Error handling

Clear conversation

Markdown formatting

Do not fake AI responses.

If an AI API key is required, create the required environment variable configuration and clearly document where I need to add the key.

15. SMART RECOMMENDATION SYSTEM

Create a basic recommendation engine.

Use:

User interests

Event categories

Saved resources

Followed topics

Community activity

to recommend:

Events

Learning resources

People

Discussions

The system should have a clear structure so it can later be upgraded with machine learning.

16. SEARCH

Implement global search.

Search across:

Events

People

Posts

Resources

Communities

Create a polished search experience.

Show categorized search results.

17. NOTIFICATIONS

Create a notification system.

Examples:

Someone followed you

Someone liked your post

Someone commented

Event registration confirmed

New recommended event

New community activity

Include:

Unread count

Mark as read

Mark all as read

18. BOOKMARKS

Users should be able to bookmark:

Events

Posts

Learning resources

Create a dedicated:

"Saved"

page.

Organize saved content by type.

19. ADMIN DASHBOARD

Create a protected admin dashboard.

Admin should be able to:

View users

Create events

Edit events

Delete events

Manage posts

Manage learning resources

View registrations

View basic platform statistics

Dashboard statistics:

Total users

Total events

Total registrations

Total posts

Active users

Use charts where appropriate.

20. DATABASE

Create a properly normalized Supabase PostgreSQL database.

Suggested tables:

profiles
user_interests
interests
events
event_registrations
event_speakers
posts
comments
likes
follows
bookmarks
learning_resources
learning_progress
notifications
communities
community_members
conversations
messages

Add appropriate:

Primary keys

Foreign keys

Indexes

Timestamps

Constraints

Use Row Level Security policies.

Users must only be able to modify their own private data.

21. SECURITY

Implement:

Supabase authentication

Protected routes

Row Level Security

Input validation

Secure API handling

No API secrets exposed in frontend

Environment variables

Never hardcode API keys.

22. DEMO DATA

Populate the application with realistic demo data.

Create at least:

10 events

15 learning resources

15 community posts

10 users

Multiple comments

Multiple likes

Multiple interests

Several notifications

Make the data look realistic and professional.

Do not use lorem ipsum.

23. UX DETAILS

Add:

Loading skeletons

Empty states

Error states

Success notifications

Confirmation dialogs

Form validation

Toast messages

Responsive layouts

Every button should either work or clearly indicate functionality that requires configuration.

Do not create fake buttons that do nothing.

24. ANIMATIONS

Use subtle professional animations.

Examples:

Card hover

Page transitions

Button interactions

Modal transitions

Notification animations

AI typing indicator

Scroll reveal

Do not overuse animations.

The application must remain fast.

25. ACCESSIBILITY

Follow good accessibility practices.

Include:

Semantic HTML

Keyboard navigation

Accessible labels

Proper contrast

Focus states

Alt text

Screen-reader-friendly components

26. ERROR HANDLING

Every API/database operation must have proper:

Loading state

Success state

Error state

Show useful messages to users.

Never leave the interface stuck on loading.

27. PROJECT STRUCTURE

Organize the project cleanly.

Use reusable components.

Separate:

Pages

Components

Hooks

Services

Database logic

Types

Utilities

Avoid putting everything into one huge component.

Use TypeScript properly.

Avoid unnecessary any.

28. README

Create a comprehensive README.md containing:

Project name

Problem statement

What we built

Key features

Tech stack

Architecture

Database structure

How authentication works

How AI integration works

Environment variables

Local setup instructions

How to run the project

How to deploy

Future improvements

Also include:

AI-Assisted Development

Explain that the project was built using AI-assisted development and include a reference to the project's prompt history.

29. PROMPTS.MD

Create a file called:

PROMPTS.md

This file should document the actual development prompts used while building the project.

Organize it into:

Initial architecture prompt

UI/UX prompt

Authentication prompt

Database prompt

Events prompt

Community prompt

Learning system prompt

AI assistant prompt

Recommendation system prompt

Admin dashboard prompt

Testing/debugging prompts

Deployment prompts

Keep this file editable so I can add the actual prompts used during development.

IMPORTANT:
Do not fabricate a claim that a prompt was used if it wasn't. The purpose of this file is to maintain a transparent AI development log.

30. GITHUB READINESS

Make the project ready for a public GitHub repository.

Include:

README.md

PROMPTS.md

.gitignore

Environment variable example file

Clean source code

No secrets

No API keys

No unnecessary generated files

Create a .env.example file showing required variables without exposing actual secrets.

31. DEPLOYMENT

Make the application deployment-ready.

The application should be compatible with Vercel or another modern hosting platform.

Make sure:

Production build works

Routing works

Environment variables are documented

Supabase configuration is documented

AI API configuration is documented

32. FINAL QUALITY CHECK

Before considering the project complete, inspect the entire application.

Check:

Every route works

Navigation works

Authentication works

Database operations work

Forms work

Search works

Filters work

Events work

Registration works

Posts work

Comments work

Likes work

Bookmarks work

Follow system works

Notifications work

Profile editing works

AI assistant works when API key is configured

Admin protection works

Responsive design works

No broken links

No console errors

No obvious UI bugs

Fix all issues you find.

Do not stop after creating the homepage.

I want the result to feel like a real, launch-ready technology community platform and a strong hackathon submission.

IMPORTANT WORKFLOW

Do NOT generate everything as one giant unfinished implementation.

First create the complete architecture and design system.

Then implement the application feature-by-feature while keeping the application runnable.

After each major feature, check for errors and fix them before continuing.

At the end, provide me with a simple explanation of:

What was built

How the database works

How to configure Supabase

How to configure the AI API

How to run locally

How to deploy

What I need to do manually before submitting the hackathon project

Remember: I am a complete beginner, so keep all setup instructions extremely clear and step-by-step.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ignite-commune-quest.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/82890ecf-d042-4c58-8f85-5a259aab1eb1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
