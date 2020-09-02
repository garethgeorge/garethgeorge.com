# AR MemoryPalace for iOS

Created by Gareth George and Dana Nguyen

In this project we provide our take on an augmented reality memory palace learning tool built using the great ARKit and SceneKit libraries provided on iOS.
Our project is runnable on any iOS device with support for these libraries (iPhone X and up).

## Background

Memory palaces (sometimes referred to as the method of loci) have an ancient history going back to the time of Roman and Greek orators.

Memory palaces are a memorization strategy which enhances the recall of information by associating it with objects in a familar spatial environment. Once these associations have been trained, recallation of the information is enhanced as the user can visually imagine a journey from the environment and recall the locations where they mentally placed the information.

Additionally, studies such as 'Virtual Memory Palaces: Immersion Aids Recall' (by Krokos et. al) have established when virtual (VR) memory palaces are used in training they can even enhance the quality of recollection -- by their results training with head mounted displays improved recollection by ~9%.

We attempt to extend these principles into augmented reality using an AR app on mobile devices to help users attach material to memorize to physical objects, study these mappings, and test themselves on the content.

## Running the project

**The project has only been tested on iPhone iOS version 13.4+**

1. Open 'MemoryPalace.xcworkspace' in Xcode
2. Build the project by clicking the 'play' button.
   - If build does not work, try to go into build settings > signing and capabilities, and change the team and build identifier

## Project Demo Video

[Demo Video Here](./armemorypalace.mp4)

## Engineering Challenges

### User Experience & User Interface Implementation and Designs

ARKit provides several different views that we leverage in our app. We provide two editable viewing modes from which markers are created and edited:

- **marker list view:** contains some of the marker metadata (the hint and the fact). Additionally, this view allows users to easily edit and delete all the markers that they have created.

* **spatial marker view:** makes it easy to visualize the memory palace in the surrounding home/place. Here, users are able to add markers onto furniture/objects. This is done by detecting screen presses and casting a ray into the scene. This ray is checked for intersections with estimated surfaces in the pointcloud of features that have been detected in the scene.

In the spatial marker view, when an object is tapped, users are prompted with the marker creation/editing view. Users can define hints and facts, and have the option to choose different colors for their repsective markers. Users can also use emojis as hints or embed these emojis within their facts. We found the use of emojis more helpful by just properly supporting Unicode, instead of bloating our app with AR models, especially since there are tons of emojis that already exist. Additionally, instead of having to use the marker list view, users also have the ability to tap an existing marker and update or delete the marker from the spatial marker view.

<br/>
<img src="./image/marker_edit.png" width="200" />
<img src="./image/marker-list.png" width="200" />

Furthermore, we wanted to provide a progression of difficulty levels so that users can ease into the process of learning / memorizing concepts. We use the UISegmentedControl, provided by SceneKit to create three different study view modes:

- **Study/Edit mode:** provides all available info (location of the markers, thesequence number, hints, and facts/answers)
- **Quiz view mode:** this is intended as an intermediate step in the learning process, providing the locations of the markers, hints, and the sequence numbers
- **Test view mode:** intended for full recall testing. The user is only shown only the locations of the markers and the sequence order. This acts more like the memory palace we know today.

<br/>
<img src="./image/quiz_view.png" width="200" />
<img src="./image/test_view.png" width="200" />

### World Tracking Challenges & Solutions

<img align="right" style="margin: 10px" src="./image/limit-track.png" width="200" />

ARKit provides us with out of the box high quality world tracking. Part of this involves the placement of ARAnchor nodes near positions of interest in the augmented reality (AR) scene. When the user's device is near an ARAnchor ARKit prioritizes the accuratcy of world tracking near that anchor, possibly at the expense of shifting objects elsewhere in the scene. This can create a problem, however, when anchors are placed down while the world is poorly mapped. As ARKit's understanding of the world changes, it will update the positions of these anchors and this can create distortion as ARKit tries to resolve the constraints of anchors near one another.

To mitigate this effect, it is important to communicate the state of the app's world mapping to the user as well as instructions on how they can properly help the app recover / better understand the space. To this end we implement two UI features

- we block marker placement when the app has not fully mapped the space where the marker would be placed
- we provide a text prompt which instructs the user to pan the device around the room to help with mapping when it is insufficient \* this feature is also used for relocalization (see saving & loading section) where, in addition to a prompt, we augment the display with an image of the last tracked position so that the user can return their viewport to the same position and resume their session.

Together, these features greatly reduce the number of situations in which user error can potentially corrupt the world map by creating unsatisfiable constraints between anchors and harming user experience.

### Saving & Loading Worldmap Data

<img align="left" style="margin: 10px" src="./image/load_view2.png" width="200" />

With the case of AR Memory Palaces we strongly felt that it was necessary to support a save and restore feature so that users could build up a repository of knowledge, save it, and come back to it later. This allows them to either continue adding new information or to spend more time studying / learning the arrangement of facts.

To implement saving we had to find a way to associate ARAnchors, which are serialized as part of the world map, with our model's representation of the markers. We used the 'name' property to associate a UUID, which is saved with the anchors, which associates that anchor with its corresponding marker. We can then use ARKit's world serialization API to serialize the worldmap and anchor data and save it to a file. We separately serialize and save the marker metadata as JSON and write out a apture of the camera's view. This is done as a visual reference to help the user return the same location and device orientation.

To load the worldmap, these steps are performed in rougly reverse order. We start by deserializing and loading the marker metadata into the model which holds our list of markers and other global state for the application. We then load the serialized world map which puts the device into "relocalization mode." In this mode, the device attempts to relate the features it extracts from the scene to the features it loads from the model until it is confident it has been restored to the same location. At this point both the information from the file and the new world tracking data are merged and the device places the anchors from the worldmap file into the scene. This invokes SceneKit API's to render the SCNNode representations of these anchors, the data for this is already available thanks to the model being loaded so we simply construct the marker icon as well as well as an associated label and move these into position restoring the experience.

### Future Work

- World Tracking: we would be interested to explore how the app performs on more modern Apple devices that we did not have access to such as an the iPad Pro with Apple's new lidarr scanner.

- Save & Restore: in our testing we have found save and restore to be a remarkably useful and robust. Save and restore is in most cases able to almost immediately resume tracking when returned to the device's original location and in some cases it can even restore from other locations in the mapped space. Loading and restoring memory markers can be used to map out multiple rooms in a much larger structure allowing for the creation of truly expansive memory palaces. In future work we might be able to incorporate features such as GPS tracking to automatically restore markers when a user returns to a given area, or support for image markers to automatically restore tags in a room when a user returns to it.

- Importing hints & facts list in advance: Users may want to import pre-created lists from external sources such as from Google Sheets or Quizlet, thus this feature may be useful in future iterations

- Multiple languages: Supporting multiple languages and broadening our app to the world, instead of just English-speaking countries

### Takeaways

- We found working with ARKit using SceneKit's abstractions were perfect for our project. SceneKit does little to hide the low level internals of ARKit which makes implementing features like serializing world data to save it, and sychronizing UI elements with anchors in the scene relatively easy. SceneKit also provides a great set of rendering abstractions through the SCNNode hierarchy.

- We found that intelligent UI design can go along way towards addressing user frustration when worldtracking struggles. By implementing hints to the user when an area is poorly mapped or more device movement is needed it becomes a lot more intuitive for the user to explore the space and accurately place markers that ARKit can do a good job of tracking.

- AR can help users form strong spatial associations by overlaying

# Sources

- https://developer.apple.com/documentation/arkit/creating_screen_annotations_for_objects_in_an_ar_experience
- https://developer.apple.com/documentation/arkit/world_tracking/saving_and_loading_world_data
- https://www.researchgate.net/publication/309223649_NeverMind_Using_Augmented_Reality_for_Memorization
