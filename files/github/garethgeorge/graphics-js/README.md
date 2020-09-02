# Graphics.js

Graphics.js is a small graphics package produced for the students of San Mateo High School's programming club.

## Objects
There are currently only three objects supported by the package that would be drawn on the canvas that appears on installation.
- `Rectangle`
- `Circle`
- `Text`, or label

I intended to include `Line`, but it is very difficult to build. I probably will not make it in the future because noone really uses a line when making graphics, but I'll almost always accept a given fork that wants to merge

#### Rectangle
Rectangle takes two parameters on intiallization, width and height. Start it up with something like the following.
```
var rect = new Rectangle(69, 420); //width, height
```
To have the object appear on the canvas, run the draw function `.draw()`, as shown below.
```
rect.draw();
```
There are three methods that you can use on your new `Rectangle` object:
- `setPosition(x, y)`, sets the x and y positions
- `setColor(color)`, sets the color
- `move(dx, dy)`, changes the x and y positions by `dx` and `dy`

The following is an example of the use of each of these functions:
```
rect.setPosition(100, 100);
rect.setColor('red');
rect.move(2, -12);
```

#### Circle
Circle takes a single parameter on intiallization, radius. Start it up with something like the following.
```
var c = new Circle(69);
```
To have the object appear on the canvas, run the draw function `.draw()`, as shown below.
```
c.draw();
```
There are three methods that you can use on your new `Circle` object:
- `setPosition(x, y)`, sets the x and y positions
- `setColor(color)`, sets the color
- `setRadius(radius)`, sets the radius
- `move(dx, dy)`, changes the x and y positions by `dx` and `dy`

The following is an example of the use of each of these functions:
```
c.setPosition(100, 100);
c.setColor('red');
c.setRadius(34);
c.move(2, -12);
```

#### Text
Text takes a two parameters on intiallization, the label text and font information. Start it up with something like the following.
```
var t = new Text('pc for lyfe', '14pt comic-sans');
```
To have the object appear on the canvas, run the draw function `.draw()`, as shown below.
```
t.draw();
```
There are three methods that you can use on your new `Text` object:
- `setPosition(x, y)`, sets the x and y positions
- `setColor(color)`, sets the color
- `setText(text)`, sets the text
- `move(dx, dy)`, changes the x and y positions by `dx` and `dy`

The following is an example of the use of each of these functions:
```
t.setPosition(100, 100);
t.setColor('red');
t.setText('blazeee');
t.move(2, -12);
```