
**This is the frontend user interface for the Vet Clinic application, built using Angular.**

It lets Admins register new staff. 
Veterinarians create and track patients, their medical history like procedures and prescriptions. 
Receptionists can make appointments with the veterinarians.

Version 2 focuses on making the interface look clean and supporting multiple languages.

* **Framework:** Angular (using modern Standalone Components)
* **Styling:** HTML5 and SCSS
* **Forms:** Reactive Forms and NgModel

What I Solved in Version 2
* Perfect Card Grid Alignment: I used SCSS and CSS line-clamping to lock all medication cards to a uniform 280px height. This keeps the grid perfectly aligned
  even if some medications have massive names or descriptions.
* Independent "Show More" Toggles: I fixed a problem of showing entity fields that are very long by creating "Show more" button.
* English & Serbian Support: I extended a custom translation service that lets the user toggle the entire app between English and Serbian instantly. This includes the forms, buttons, and validation errors.


