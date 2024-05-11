// Nav

console.log("hi")

const body = document.querySelector('body'),
sidebar = body.querySelector('nav'),
toggle = body.querySelector(".toggle"),
// searchBtn = body.querySelector(".search-box"),
modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");


toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

// searchBtn.addEventListener("click" , () =>{
//     sidebar.classList.remove("close");
// })

modeSwitch.addEventListener("click" , () =>{
    body.classList.toggle("dark");
    
    if(body.classList.contains("dark")){
        modeText.innerText = "Light mode";
    }else{
        modeText.innerText = "Dark mode";
        
    }
});


// function addToFavorieten(id) {

//     // Maak een HTTP-verzoek naar je server om het boek toe te voegen aan de favorieten
//     fetch('/add-to-favorieten', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ bookId: id }) // Verzend het boek-ID naar de server
//     })
//     .catch(error => console.error('Er is een fout opgetreden:', error));
// }


document.getElementById('submitButton').addEventListener('click', function(event) {
    event.preventDefault();
    
    const bookId = document.getElementById('bookId').value;

    const isClicked = this.classList.contains('clicked');

    fetch('/add-to-favorieten', {
        method: isClicked ? 'DELETE' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId: bookId })
    })
    .then(response => {
        if (response.ok) {

            this.classList.toggle('clicked', !isClicked);
            
            if (isClicked) {
                // If clicked again (removed from favorites), change color back to black
                document.getElementById('svg-path').style.fill = 'black';
                
                // Remove the item from the page
                const itemToRemove = document.getElementById('item_' + bookId);
                if (itemToRemove) {
                    itemToRemove.remove();
                }
            }
        } else {
            throw new Error('Error updating favorites');
        }
    })
    .catch(error => console.error('An error occurred:', error));
});
