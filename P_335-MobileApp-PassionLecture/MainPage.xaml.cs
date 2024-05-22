using System.IO.Compression;
using System.Net.Http.Headers;
using System.Reflection.Metadata;

namespace P_335_MobileApp_PassionLecture
{
    public class Book
    {
        public int id { get; set; }
        public string title { get; set; }
        public string creator { get; set; }

        public string date { get; set; }

        public Blob epub { get; set; }

        public DateTime created { get; set; }
        public DateTime updatedAt { get; set; }
    }
    public partial class MainPage : ContentPage
    {
        readonly HttpClient http = new();
        public MainPage()
        {
            InitializeComponent();
        }

        private async void Button_Clicked(object sender, EventArgs e)
        {
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNjg4NzY2MiwiZXhwIjoxNzM4NDQ1MjYyfQ.eFAK5bGDCj7dUhNPW53q5nMmufOsysM6WzAA7x5eTzM");
            try
            {
                HttpResponseMessage response = await http.GetAsync("http://10.228.242.47:3000/api/books/");

                if(response.IsSuccessStatusCode)
                {
                    HttpContent content = response.Content;

                    ZipArchive archive = new ZipArchive(content.ReadAsStream());
                }

                Content = new Label { Text = "SI1...SI2" };
            }
            catch (Exception ex)
            {
                Content = new Label { Text = ex.Message };
            }
        }

        private async void ImageButton_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new ShowDetails());
        }
    }

}
