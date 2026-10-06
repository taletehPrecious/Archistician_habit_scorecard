import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { useState, useEffect } from 'react';


 const Card1 = ({username}) =>  {
  const list = [ /* Welcome in different languages */
  'Bienvenue',
  'Welcome',
  'Hola',
  'こんにちは',
  '你好',
  '안녕하세요',
  'مرحبا',
  'नमस्ते',
  'Olá',
  'Здравствуйте'
  ];
  const [index, setIndex] = useState(0)
  const greeting = list[index];
  const [display, setDisplay] = useState(username);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, 10000); /*Change greeting every 10s */

    return () => clearInterval(interval); 
  }, [list.length]);
  
  const handleClick = () => { /* Display 'username' is fantastic when user clicks button */
      setDisplay(''+ username + ' is fantastic!');
    }
  

  return (
    /* Using Mantine Card component */
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section >
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=200&fit=crop"
          height={200}
          alt="Blue Sky"
        />
      </Card.Section>

      <Group justify="center" mt="md" mb="xs">
        <h3>{greeting}</h3>
      </Group>
 
      <Text size="l" c="dimmed" ta="center">
        {display}
      </Text> 

      {/* Call function handleClick when this button is clicked */}
      <Button onClick={handleClick} color="azure" fullWidth mt="md" radius="md"> 
        <h4>Click me</h4>
      </Button>
    </Card>
  );
}

export default Card1;