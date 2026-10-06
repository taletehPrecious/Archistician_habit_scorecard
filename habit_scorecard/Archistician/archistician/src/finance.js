import { useState } from "react";
import { CloseButton, Card, Button, TextInput, NumberInput, Group } from "@mantine/core";

function Finance() {

  const downloadPage = () => { /*function to dowlnload the budget page onece bufget is made*/
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "page.html";
    link.click();

    URL.revokeObjectURL(url);
  }

  /* Stage of the process */
  const [stage, setStage] = useState("setup"); /* Stage goes from setup -> saved -> calculate */

  /* Setup variables */
  const [total, setTotal] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryPercent, setCategoryPercent] = useState('');
  const [error, setError] = useState(null)

  const [amount, setAmount] = useState('');

  /* Save final percentages */
  const [savedCategories, setSavedCategories] = useState([]);

  /* Add category */
  const addCategory = () => {
    if (!categoryName || !categoryPercent) {
        setError('Please fill out all fields')
        return;
    }

    setCategories([ /* update categories to contain new one */
      ...categories,
      { name: categoryName, percent: Number(categoryPercent) },
    ]);

    setCategoryName(''); /* Make the input fields blank again for the next category to be added */
    setCategoryPercent('');
  };

  /* Save setup */
  const saveBudget = () => {
    /* One line loop to sum percentages */
    const totalPercent = categories.reduce((sum, c) => sum + c.percent, 0);
    if (totalPercent !== 100) { /* Set error is percentages don't add up to 100 */
      setError('Percentages must add up to 100%');
      return;
    }

    setSavedCategories(categories); /* update saved categories with all the categories */
    setStage('calculate'); /* Change the stage to calculation stage */
  };

  /* Function to Calculate spending */
  const getAmounts = () => {
    if (!amount) return []; /* Return nothing is no amount is inputted */
    return savedCategories.map((cat) => ({ /* Loop through saved categories, set name and calculate value */
      name: cat.name,
      value: ((cat.percent / 100) * Number(amount)).toFixed(2),
    }));
  };

  return (
    <div style={{ width: '60%', maxWidth: "800px", margin: "auto", marginTop: "2rem" }}>
      <Card shadow="md" padding="lg">

        {/* Getting categories and percentages from user */}

        {/* Run this code only if stage is setup*/}
        {stage === 'setup' && ( 
          <>
            {error && <p style={{textAlign: 'center', color: 'red'}}>{error}</p>}
            <h2>Your Quick Finance Planner</h2>
            <h3 style={{ marginTop: "0.1rem" }}>How do you want to spend your money?</h3>
            <h3 style={{ marginTop: "1.5rem" }}>Add Categories</h3>
            <Group grow>
              <TextInput
                placeholder='Category name (e.g., Savings)'
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)} /* Update category name each time input changes */
              />

              <NumberInput
                placeholder="category %"
                value={categoryPercent}
                onChange={setCategoryPercent} /* Update category percent each time input changes */
              />
            </Group>

            {/* Call function category each time this function is clicked */}
            <Button color="green" variant="light" onClick={addCategory} mt="md">
              Add Category
            </Button>

            <div style={{ marginTop: "1rem" }}>
              {categories.map((c, i) => (
                <div style={{display: 'flex', alignContent: 'center'}}key={i}>
                  {c.name} — {c.percent}%

                  {/* When the x button is clicked, filter the current category out of the categories list */}
                  <CloseButton  ml="1rem" h='1rem' w='4rem' p='0' onClick={() => 
                        {setCategories(prev =>
                        prev.filter(cat => cat.name !== c.name)
                  );}}><p style={{color: 'red', fontSize:'0.8rem'}}>remove</p></CloseButton>
                </div>
              ))}
            </div>

            {/* Run saveBudget each time this button is clicked */}
            <Button color="#299154" mt="lg" onClick={saveBudget}>
              Save Budget specifications
            </Button>
          </>
        )}

        {/* Calculations */}
        {stage === 'calculate' && (
          <>
            <h2>Your Budget Plan</h2>

            <div className="sidecontent">
            {savedCategories.map((c, i) => (
              <div key={i}>
                <b>{c.name}</b> — {c.percent}%
              </div>
            ))}
            </div>

            <NumberInput
              label="Enter an amount to calculate"
              value={amount}
              onChange={setAmount}
              mt="lg"
            />

            <h3 style={{ marginTop: "1rem" }}>Amounts to Spend</h3>
            {getAmounts().map((a, i) => ( /* Call amounts and loop through to print the returned values*/
              <div key={i}>
                {a.name}: <b>${a.value}</b>
              </div>
            ))}

            {/* Go back to set up stage when this button is clicked */}
            <Button color="green" variant="light" mt="lg" onClick={() => setStage('setup')}>
              Edit Budget
            </Button>

            {/* Call download page if this button is clicked */}
            <Button color="#299154" mt="md" onClick={downloadPage} >
                Download This Page
            </Button>
          </>
        )}

      </Card>
    </div>
  );
}

export default Finance;

