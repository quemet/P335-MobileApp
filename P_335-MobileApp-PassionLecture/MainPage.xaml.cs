using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.IO.Compression;
using IOPath = System.IO.Path;
using Microsoft.Maui.Controls.Shapes;

namespace P_335_MobileApp_PassionLecture
{
    /// <summary>
    /// Classe pour définir le contenu du livre
    /// </summary>
    public class BookContent
    {
        public string Type { get; set; }
        public List<byte> Data { get; set; }
    }

    /// <summary>
    /// Classe pour définir un livre avec ces différentes informations
    /// </summary>
    public class Book
    {
        public int Id { get; set; }
        public string title { get; set; }
        public string creator { get; set; }
        public BookContent epub { get; set; }
        public string date { get; set; }
        public DateTime created { get; set; }
        public DateTime updatedAt { get; set; }
    }

    /// <summary>
    /// Classe pour gérer la logique de l'application. Appel API, etc...
    /// </summary>
    public partial class MainPage : ContentPage
    {
        static readonly HttpClient client = new HttpClient();

        public List<Book> Books { get; set; }
        private List<Book> FilteredBooks { get; set; }

        /// <summary>
        /// Seul constructeur de cette classe
        /// </summary>
        public MainPage()
        {
            client.Timeout = TimeSpan.FromMinutes(1);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNjgxMTQ2NCwiZXhwIjoxNzQ4MzY5MDY0fQ.BrD0S_qckBB1iVsKZCYhd9jHpw-B4Q_B-DBBZv1dn74");
            client.BaseAddress = new Uri("http://10.0.2.2:3000");

            InitializeComponent();
            LoadBooks();
            SizeChanged += OnSizeChanged;
        }

        private void OnSizeChanged(object sender, EventArgs e)
        {
            double screenWidth = Width;
            double screenHeight = Height;

            // Boucle sur les enfants de notre StackLayout ou sont tout les livres
            foreach (var view in BooksStackLayout.Children)
            {
                if (view is Border border)
                {
                    border.WidthRequest = screenWidth * 0.8;
                    border.HeightRequest = screenHeight * 0.25;
                }
            }
        }

        /// <summary>
        /// Fonction pour gérer le clique sur le bouton Lire. Pour afficher le contenu du livre
        /// </summary>
        /// <param name="sender">Contient des informations sur le controlleur cliqué</param>
        /// <param name="e">Contient des données sur l'évenement</param>
        private async void Button_Clicked(object sender, EventArgs e)
        {
            var button = sender as Button;
            var bookId = (int)button.CommandParameter;
            await OpenBook(bookId);
        }

        /// <summary>
        /// Fonction qui permet de faire un appel API sur notre backend. Pour retrouver tout les livres
        /// </summary>
        private async void LoadBooks()
        {
            try
            {
                // Prend la réponse de notre appel
                HttpResponseMessage response = await client.GetAsync("/api/books");

                // Check si la requête à réussi
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse);

                    // Si notre API nous retourne des données alors on continue sinon on arrête
                    if (jsonObject.ContainsKey("data"))
                    {
                        var booksJson = jsonObject["data"].ToString();
                        Books = JsonConvert.DeserializeObject<List<Book>>(booksJson);
                        FilteredBooks = new List<Book>(Books);

                        // Permet d'afficher tout les livres récupéré dans notre base de données
                        DisplayBooks(FilteredBooks);

                        LoadingIndicator.IsVisible = false;
                        LoadingIndicator.IsRunning = false;
                        BooksStackLayout.IsVisible = true;

                        OnSizeChanged(null, null);
                    }
                    else
                    {
                        Debug.WriteLine("Erreur : la réponse JSON ne contient pas de propriété 'data'");
                    }
                }
                else
                {
                    Debug.WriteLine($"Erreur lors du chargement des livres: {response.ReasonPhrase}");
                }
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"Erreur HTTP: {ex.Message}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Erreur: {ex.Message}");
            }
        }

        /// <summary>
        /// Affiche tout les livres à l'écran
        /// </summary>
        /// <param name="books">Le liste de livres de l'appel API</param>
        private void DisplayBooks(List<Book> books)
        {
            BooksStackLayout.Children.Clear();

            // Boucle sur les livres envoyé par notre base de données
            foreach (var book in books)
            {
                // Ajoute le bouton pour lire
                var button = new Button
                {
                    Text = "Lire",
                    HorizontalOptions = LayoutOptions.Center,
                    VerticalOptions = LayoutOptions.EndAndExpand,
                    BackgroundColor = Color.FromArgb("#BD8B9C"),
                    CommandParameter = book.Id
                };
                button.Clicked += Button_Clicked;

                // Défini un bordure et défini un nouveau Stacklayout avec les labels avec le titre et le auteur
                var border = new Border
                {
                    // Défini la couleur de la bordure
                    Stroke = Color.FromArgb("#414770"),
                    BackgroundColor = Color.FromArgb("#414770"),
                    MinimumWidthRequest = 90,
                    MinimumHeightRequest = 30,
                    // Défini l'épaisseur pour la bordure
                    StrokeThickness = 4,
                    // Défini les coins des bordeurs pour avoir un arrondi
                    StrokeShape = new RoundRectangle
                    {
                        CornerRadius = new CornerRadius(30)
                    },
                    // Défini un padding pour éviter de coller les boîtes
                    Padding = new Thickness(16, 8),
                    HorizontalOptions = LayoutOptions.Center,
                    Content = new Grid
                    {
                        BackgroundColor = Color.FromArgb("#414770"),
                        Children =
                        {
                            new StackLayout
                            {
                                HorizontalOptions = LayoutOptions.Center,
                                MinimumWidthRequest = 60,
                                Children =
                                {
                                    new Label
                                    {
                                        TextColor = Colors.White,
                                        FontSize = 18,
                                        FontAttributes = FontAttributes.Bold,
                                        Text = book.title + "\n",
                                        HorizontalTextAlignment = TextAlignment.Center,
                                    },
                                    new Label
                                    {
                                        TextColor = Colors.White,
                                        FontSize = 16,
                                        FontAttributes = FontAttributes.Bold,
                                        Text = book.creator,
                                        HorizontalTextAlignment = TextAlignment.Center,
                                    },
                                    button
                                }
                            }
                        }
                    }
                };

                border.WidthRequest = Width * 0.8;
                border.HeightRequest = Height * 0.25;

                // Ajoute au StackLayout à la box créer
                BooksStackLayout.Children.Add(border);
            }
        }

        /// <summary>
        /// Fonction qui permet de sàlectionner uniquement les livres suivant l'entrée de l'utilisateur
        /// </summary>
        /// <param name="sender">Contient des informations sur le controlleur cliqué</param>
        /// <param name="e">Contient des données sur l'évenement quand le text change</param>
        private void OnSearchBarTextChanged(object sender, TextChangedEventArgs e)
        {
            string searchText = e.NewTextValue.ToLower();

            FilteredBooks = Books.Where(b => b.title.ToLower().Contains(searchText) || b.creator.ToLower().Contains(searchText)).ToList();
            DisplayBooks(FilteredBooks);
        }

        /// <summary>
        /// Fonction qui fait un appel à notre backend. Pour retrouver toute les infos sur un livre.
        /// </summary>
        /// <param name="bookId"></param>
        /// <returns></returns>
        private async Task OpenBook(int bookId)
        {
            try
            {
                // Prend la réponse de notre appel
                HttpResponseMessage response = await client.GetAsync($"/api/books/{bookId}");

                // Check si le requête a bien été réussi
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse);

                    // Check si l'API nous renvoie des données
                    if (jsonObject.ContainsKey("data"))
                    {
                        var bookJson = jsonObject["data"].ToString();
                        var book = JsonConvert.DeserializeObject<Book>(bookJson);

                        // Check si il nous renvoie null ou vide
                        if (book.epub?.Data != null && book.epub.Data.Count > 0)
                        {
                            byte[] epubContent = book.epub.Data.ToArray();

                            if (epubContent.Length == 0)
                            {
                                Debug.WriteLine("Le contenu du fichier EPUB est vide.");
                                return;
                            }

                            // Montre le contenu du ePUB
                            await OpenEpubFile(epubContent, book.title, book.creator);
                        }
                        else
                        {
                            Debug.WriteLine("Le contenu du livre est vide ou manquant.");
                        }
                    }
                    else
                    {
                        Debug.WriteLine("Erreur : la réponse JSON ne contient pas de propriété 'data'");
                    }
                }
                else
                {
                    Debug.WriteLine($"Erreur lors de la récupération du contenu: {response.ReasonPhrase}");
                }
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"Erreur HTTP: {ex.Message}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Erreur: {ex.Message}");
            }
        }

        /// <summary>
        /// Ouvre le fichier ePUB et affiche les données dedans
        /// </summary>
        /// <param name="epubContent">le fichier epub</param>
        /// <param name="title">le titre du livre</param>
        /// <param name="author">L'auteur du livre</param>
        /// <returns></returns>
        public async Task OpenEpubFile(byte[] epubContent, string title, string author)
        {
            string filePath = IOPath.GetTempFileName();
            await File.WriteAllBytesAsync(filePath, epubContent);

            try
            {
                List<string> contentList = new List<string>();

                // Lire le fichier epub
                using (ZipArchive archive = ZipFile.OpenRead(filePath))
                {
                    // Boucle sur les entrées de l'archive
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        // Check si les fichiers sont des fichiers .html ou -xhtml
                        if (entry.FullName.EndsWith(".xhtml", StringComparison.OrdinalIgnoreCase) ||
                            entry.FullName.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
                        {
                            // Lis le ePUB
                            using (StreamReader reader = new StreamReader(entry.Open()))
                            {
                                string content = await reader.ReadToEndAsync();
                                contentList.Add(content);
                            }
                        }
                    }
                }

                string fullContent = string.Join("\n\n", contentList);
                await Navigation.PushAsync(new ReadBook(title, fullContent));
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Erreur lors de la lecture du fichier EPUB: {ex.Message}");
            }
            finally
            {
                File.Delete(filePath);
            }
        }
    }
}
