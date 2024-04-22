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
    fetchJson(apiItem + '?filter={"id":' + request.params.id + '}').then((itemsDataUitDeAPI) => {
        response.render('detail', {items: itemsDataUitDeAPI.data})
    });
})




app.get('/leeslijst', function (request, response) {
  fetchJson(apiItem).then((itemsDataUitDeAPI) => {

  })
})



// 3. Start de webserver

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
