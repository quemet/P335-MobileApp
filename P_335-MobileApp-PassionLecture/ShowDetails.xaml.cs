namespace P_335_MobileApp_PassionLecture;

public partial class ShowDetails : ContentPage
{
	public ShowDetails()
	{
		InitializeComponent();
	}

    private void Button_Clicked(object sender, EventArgs e)
    {
		Navigation.PushAsync(new ReadBook());
    }
}