console.log('Hier komt je server voor Sprint 10. Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')


console.log('Hier komt je server')

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

app.use(express.json());

// In deze object gaan we de items toevoegen
let leeslijst = []


// wat ik heb zelf geschreven//

// Maak een GET route voor de index

// Stel het basis eindpoint in
const apiUrl = "https://fdnd-agency.directus.app/items/"
const apiFamily = (apiUrl + 'oba_family')
const apiProfile = (apiUrl + 'oba_profile')
const apiItem = (apiUrl + 'oba_item')


app.get('/', function(request, response) {
  fetchJson(apiItem + "?fields=*,afbeelding.id,afbeelding.height,afbeelding.width").then((itemsDataUitDeAPI) => {
      let books = []
      let cds = []
      let activities = []
      console.log(itemsDataUitDeAPI) 
      itemsDataUitDeAPI.data.forEach(function(item) {
        if (item.item_type == 'book') {
          books.push(item)
          console.log(books)
        } else if (item.item_type == 'cd') {
          cds.push(item)
        } else if (item.item_type == 'activity') {
          activities.push(item)
        }
      })

      response.render('index', {
        books: books,
        cds: cds,
        activities: activities
      })
  });
})


app.get('/family', async function(request, response) {
  try {
    const families = await fetchJson(apiFamily);
    const profiles = await fetchJson(apiProfile);

    console.log(families.data);
    console.log(profiles.data);

    response.render('family', {
      families: families.data,
      profiles: profiles.data,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    response.status(500).send('Internal Server Error');
  }
});


app.get('/detail/:id', function(request, response) {
    fetchJson(apiItem + '?filter={"id":' + request.params.id + '}' ).then((itemsDataUitDeAPI) => {
        response.render('detail', {items: itemsDataUitDeAPI.data})
    });
})


app.get('/leeslijst', function (request, response) {
  fetchJson(apiItem).then((itemsDataUitDeAPI) => {
    const itemsOnReadingList = itemsDataFromAPI.data.filter(item => leeslijst[item.id]);

    if (itemsOnReadingList.length) {
        response.render('leeslijst', { items: itemsOnReadingList });
    } else {
        console.error("Invalid or unexpected API response format");
        response.status(500).send("Internal Server Error");
    }
  });
});


app.post('/detail/:id', function (request, response) {
  // Extract the item ID from the request parameters
  const itemId = request.params.id;

   leeslijst[itemId] = true;

   fetchJson(apiItem)
   .then((itemsDataFromAPI) => {

       const itemsOnReadingList = itemsDataFromAPI.data.filter(item => leeslijst[item.id]);

       if (itemsOnReadingList.length) {
      
           response.render('leeslijst', { items: itemsOnReadingList });
       } else {
           console.error("Invalid or unexpected API response format");
           response.status(500).send("Internal Server Error");
       }
   })
});




let favorieten = [];

app.get('/favorieten', function(request, response) {
 
    fetchJson('https://fdnd-agency.directus.app/items/oba_item')
        .then((itemsDataFromAPI) => {
            // Add items to favorites
            const data = itemsDataFromAPI.data;
            const filteredResponse = data.filter(obj => favorieten.includes(obj.id));

            if (filteredResponse.length === 0) {
                
                response.render('favorietenEmptyState');
            } else {
            
                response.render('favorieten', { items: filteredResponse });
            }
        })
        .catch(error => {
            console.error('Error fetching items from API:', error);
            response.status(500).send('Internal Server Error');
        });
});


// Endpoint om een item toe te voegen aan de favorieten
app.post('/add-to-favorieten', (req, res) => {
  const id = parseInt(req.body["bookId"])

  favorieten.push(id);

  res.status(201).json({ message: 'Item succesvol toegevoegd aan favorieten' });
});



// 3. Start de webserver

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
