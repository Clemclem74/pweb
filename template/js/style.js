function show_trailer(idtrailer, idfilm)
{
  if (document.getElementById(idtrailer).style.display == 'none')
  {
        if( document.getElementById(idfilm).style.display == 'block' ) {

            document.getElementById(idfilm).style.display = 'none';
            document.getElementById(idtrailer).style.display = 'block';
        }  
        else {
            document.getElementById(idtrailer).style.display = 'block';
        }
  }
  else 
  {
       document.getElementById(idtrailer).style.display = 'none';
  }
}

function show_film(idfilm, idtrailer)
{
  if (document.getElementById(idfilm).style.display == 'none')
  {
    if( document.getElementById(idtrailer).style.display == 'block' ) {

        document.getElementById(idtrailer).style.display = 'none';
        document.getElementById(idfilm).style.display = 'block';
    }  
    else {
        document.getElementById(idfilm).style.display = 'block';
    }
  }
  else 
  {
       document.getElementById(idfilm).style.display = 'none';
  }
}