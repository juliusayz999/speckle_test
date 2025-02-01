import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  UrlHelper,
} from "@speckle/viewer";
import { CameraController, SelectionExtension } from "@speckle/viewer";

async function main() {
  // Get the HTML container for rendering
  const container = document.getElementById("renderer");

  // Viewer parameters
  const params = DefaultViewerParams;
  params.showStats = false;
  params.verbose = true;

  // Create and initialise the Viewer
  const viewer = new Viewer(container as HTMLElement, params);
  await viewer.init();

  // Add extensions
  viewer.createExtension(CameraController);
  viewer.createExtension(SelectionExtension);

  // Speckle Model URLs
  const modelUrls = [
    "https://app.speckle.systems/projects/d1169918b7/models/3ee114c096"
  ];

  // Load models and handle layers
  for (const modelUrl of modelUrls) {
    const urls = await UrlHelper.getResourceUrls(modelUrl);
    for (const url of urls) {
      const loader = new SpeckleLoader(viewer.getWorldTree(), url, "");
      const loadedObject = await viewer.loadObject(loader, true);

      // Extract and display layers
      setupLayerControls(loadedObject, viewer);
    }
  }
}

/** Sets up layer visibility controls */
function setupLayerControls(loadedObject: any, viewer: Viewer) {
  // Debug to check where layer information might exist
  console.log("Loaded Object for Layers:", loadedObject);

  // Attempt to access layers (adjust this based on your model's structure)
  const layers = loadedObject.layers || loadedObject.metadata?.layers || [];

  if (layers.length === 0) {
    console.warn("No layers found in the loaded object.");
    return;
  }

  const layersContainer = document.getElementById("layersList");

  layers.forEach((layer: any) => {
    // Create a checkbox for each layer
    const layerItem = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true; // Layers are visible by default
    checkbox.id = `layer-${layer.id}`;
    checkbox.addEventListener("change", () => {
      // Toggle layer visibility
      toggleLayerVisibility(viewer, layer.id, checkbox.checked);
    });

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = layer.name || `Layer ${layer.id}`;

    layerItem.appendChild(checkbox);
    layerItem.appendChild(label);
    layersContainer.appendChild(layerItem);
  });
}


/** Toggles the visibility of objects in a specific layer */
function toggleLayerVisibility(viewer: Viewer, layerId: string, isVisible: boolean) {
  viewer.getWorldTree().traverse((node: any) => {
    if (node.layer === layerId || node.metadata?.layer === layerId) {
      node.visible = isVisible;
    }
  });
}


// Call the main function
main();
