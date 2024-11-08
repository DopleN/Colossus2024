import Main from '../main.js';
import Header from '../header.js';

class Stores {
  constructor() {
    this.initMap();
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { PlacesService } = await google.maps.importLibrary("places");

    const centerLatlng = { lat: 25.7617, lng: -80.1918 }; // Center around Miami, FL

    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: centerLatlng,
    });

    this.service = new google.maps.places.PlacesService(this.map);

    this.loadBranches();
  }

  async loadBranches() {
    this.showLoadingIndicator();
    const branches = await this.fetchBranches();
    this.hideLoadingIndicator();

    if (branches.length === 0) {
      this.showErrorMessage("No branches found.");
      return;
    }

    this.addMarkers(branches);
  }

  async fetchBranches() {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        console.error('Failed to fetch branches:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }

  addMarkers(branches) {
    const placeNames = branches.map(branch => branch.location);
    placeNames.forEach(placeName => {
      const request = { query: placeName, fields: ["name", "geometry"] };
      this.service.textSearch(request, (results, status) => this.handleSearchResult(results, status));
    });
  }

  handleSearchResult(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(result => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: result.geometry.location,
          map: this.map,
          title: result.name,
        });

        marker.addListener("click", () => {
          this.map.setZoom(8);
          this.map.setCenter(marker.position);
        });
      });
    } else {
      console.error(`Places search was not successful: ${status}`);
    }
  }

  showLoadingIndicator() {
    // Implement logic to show a loading spinner or message
  }

  hideLoadingIndicator() {
    // Implement logic to hide the loading spinner or message
  }

  showErrorMessage(message) {
    // Implement logic to display an error message to the user
  }
}

function initStores() {
  window.addEventListener('load', () => new Stores());
}

initStores();
Main.initComponents([Header]);
Main.hidePreLoader();
