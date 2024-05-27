using Microsoft.Maui.Controls;

namespace P_335_MobileApp_PassionLecture
{
    public partial class ReadBook : ContentPage
    {
        /// <summary>
        /// Seul constructeur de la class ReadBook
        /// </summary>
        /// <param name="title">Le titre du Livre</param>
        /// <param name="content">Le contenu du Livre</param>
        public ReadBook(string title, string content)
        {
            InitializeComponent();
            TitleLabel.Text = title;
            TitleLabel.HorizontalTextAlignment = TextAlignment.Center;
            ContentWebView.Source = new HtmlWebViewSource
            {
                Html = content
            };
        }

        /// <summary>
        /// Fonction pour faire revenir au menu
        /// </summary>
        /// <param name="sender">Contient des informations sur le controlleur cliqu�</param>
        /// <param name="e">Contient des donn�es sur l'�venement</param>
        private async void OnBackButtonClicked(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
    }
}