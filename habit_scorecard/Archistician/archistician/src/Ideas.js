/* Ideas.js shows all the user's ideas */
import { Center, Card, Text, ColorInput } from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Ideas = () => {
  const history = useHistory();
  const [ideas, setIdeas] = useState([]);
  const [colors, setColors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/ideas", { /* Fetch all ideas by default GET method */
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIdeas(data);

        const initialColors = {};
        data.forEach((idea) => {
          initialColors[idea.id] = idea.color || "#ffe5e5"; /* fallback color */
        });

        setColors(initialColors);
      })
      .catch((err) => console.error("Sorry,", err)); /* Catch any error */
  }, []);

  const handleClick = () => { /* Function redirects to create page */
    history.push("/create");
  };

  const updateColor = (id, newColor) => { /* set color to the one chosen by the user */
    setColors((prev) => ({
      ...prev,
      [id]: newColor,
    }));

    /* Add chosen color to the idea's record idea database */
    fetch(`http://localhost:5000/ideas/${id}/color`, { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ color: newColor }),
    });
  };

  return (
    <>
      <div className="ideas">
        <div className="new-idea-button" styles={{ flex: '1 1 auto'}}>
          <h2>Your Idea Sticky Notes</h2>
          <button style={{marginTop: 0}} onClick={handleClick}>Add Idea</button>
        </div>
        {ideas.map((idea) => (
          <div className="idea-card" key={idea.id}>

            {/* Mantine colorInput component */}
            <ColorInput
              variant="filled"
              label="Change Color"
              description="Do you want a different color for your sticky note?"
              value={colors[idea.id]}
              /*change newColor each time the input changes*/
              onChange={(newColor) => updateColor(idea.id, newColor)}
              withEyeDropper={true}
              styles={{
                input: {
                color: "#f1f3f5",   /*To hide the hex value showing*/
                caretColor: "#f1f3f5",  
                }
               }}
            />

            <Link /* Link the card to the idea's details so that details show when card is clicked */
              to={`/ideas/${idea.id}`} /* Link to dynamic route with this idea's id */
              style={{ textDecoration: "none" }}
            >

              <Card
                h={150}
                style={{
                  backgroundColor: colors[idea.id],
                  flex: "1 1 auto",
                }}
              >
                <Text fw={300} c="black">
                  {idea.idea_name}
                </Text>
                <p>Added on {idea.idea_added}</p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Ideas;
