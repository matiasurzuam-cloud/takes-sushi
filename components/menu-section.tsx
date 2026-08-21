'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Leaf, Flame, Plus, Minus, ShoppingBag, Store, Bike, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { TOTEAT_URL, MENU_UNLOCK_KEY, MENU_UNLOCK_EVENT } from '@/components/carta-modal'
import { celebrate } from '@/lib/confetti'

type MenuItem = {
  name: string
  price: number
  description?: string
  top?: boolean
  vegan?: boolean
}

// Un ítem tal como se muestra en una lista, con su categoría de origen ya
// resuelta — necesario porque la pestaña "Vegano" mezcla ítems de varias
// categorías reales (sushi, entradas, almuerzo…) en una sola vista, pero
// cada uno debe seguir apuntando a SU categoría real: así el carrito no
// duplica el mismo plato si se agrega desde ambas pestañas, y el pedido de
// WhatsApp lo agrupa bajo su sección real en vez de bajo "Vegano".
type MenuItemWithCategory = MenuItem & { categoryId: string }

type Promo = {
  title: string
  detail?: string
  highlight?: string
  sub?: string
}

type Category = {
  id: string
  label: string
  note: string
  image: string
  items: MenuItem[]
  promo?: Promo
}

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-CL')}`
}

const categories: Category[] = [
  {
    id: 'entradas',
    label: 'Entradas & Picoteos',
    note: 'papas fritas, furays, empanaditas y gyozas',
    image: '/images/cat-entradas.png',
    promo: {
      title: 'Agrega papas fritas extra',
      detail: '200 grs',
      highlight: '$1.990',
    },
    items: [
      {
        name: 'Papas Cheddar',
        price: 10900,
        description:
          'Papas fritas bañadas en salsa de queso cheddar, cubiertas de carne de res, tocino crocante, cebolla, pimentón y cebollín fresco.',
      },
      {
        name: 'Papas Supremas',
        price: 7900,
        description:
          'Papas fritas bañadas en salsa ácida de la casa, cubiertas de cebollín y crujientes trozos de pollo apanado en panko.',
        top: true,
      },
      {
        name: 'Papas Marinas',
        price: 8500,
        description:
          'Papas fritas bañadas en salsa ácida, cubiertas de cebollín fresco y camarones apanados en panko.',
      },
      {
        name: 'Papas al Champiñón',
        price: 7900,
        description:
          'Papas fritas bañadas en salsa ácida, cubiertas de champiñones salteados, tocino y ciboulette.',
      },
      {
        name: 'Sake Ebi Ball',
        price: 7900,
        description:
          'Bolitas de camarón y queso crema al ciboulette envueltas en salmón apanado en panko. Con salsa agridulce.',
      },
      {
        name: 'Chicken Furay (5u)',
        price: 5900,
        description: 'Cinco bastones de pollo crujientes apanados en panko.',
      },
      {
        name: 'Camarón Furay (10u)',
        price: 6500,
        description: 'Diez camarones apanados en panko fritos a la perfección.',
      },
      {
        name: "Picoteo Take's",
        price: 11900,
        description:
          'Para compartir: 5 tutitos furay, 5 camarones en panko, 5 aros de cebolla y 5 empanaditas surtidas.',
        top: true,
      },
      {
        name: 'Empanaditas de Queso (5u)',
        price: 5000,
        description: 'Cinco empanaditas fritas rellenas de queso derretido.',
      },
      {
        name: 'Empanaditas de Queso Jamón (5u)',
        price: 5500,
        description: 'Cinco empanaditas fritas con clásica mezcla de jamón y queso.',
      },
      {
        name: 'Empanaditas de Queso Camarón (5u)',
        price: 5900,
        description: 'Cinco empanaditas fritas rellenas de camarones y queso.',
      },
      {
        name: 'Empanaditas de Queso Choclo (5u)',
        price: 5500,
        description: 'Cinco empanaditas fritas rellenas de queso y granos de choclo dulce.',
      },
      {
        name: 'Gyozas Vegetarianas (5u)',
        price: 5500,
        description: 'Cinco empanaditas japonesas al vapor rellenas de verduras.',
        vegan: true,
      },
      {
        name: 'Gyozas de Pollo (5u)',
        price: 5500,
        description: 'Cinco gyozas clásicas rellenas de pollo sazonado.',
      },
      {
        name: 'Gyozas de Cerdo (5u)',
        price: 5500,
        description: 'Cinco deliciosas gyozas rellenas de carne de cerdo.',
      },
      {
        name: 'Gyozas de Camarón (5u)',
        price: 5900,
        description: 'Cinco gyozas gourmet rellenas de camarón picado.',
      },
    ],
  },
  {
    id: 'sushi',
    label: 'Sushi & Rolls',
    note: 'fusión, rolls especiales, makis y californias',
    image: '/images/cat-sushi-rolls.png',
    items: [
      {
        name: 'Palmi Tartar',
        price: 8900,
        description:
          'Relleno de palta y queso crema. Apanado en panko y cubierto de un sabroso tartar de palmito al ciboulette.',
        vegan: true,
      },
      {
        name: 'Zu!',
        price: 10990,
        description:
          'Camarón apanado en panko y palta, envuelto en queso crema flambeado. Cubierto de mermelada de cebolla, tocino crocante y ciboulette.',
        top: true,
      },
      {
        name: 'Thiago',
        price: 10900,
        description:
          'Pollo apanado en panko y palta, envuelto en queso crema flambeado. Cubierto de mermelada de cebolla, quinoa crocante y ciboulette.',
      },
      {
        name: 'Pulpish',
        price: 10900,
        description:
          'Pulpo, queso crema y ciboulette. Envuelto en palta, bañado en salsa de aceitunas negras al cilantro, toque agridulce y camote hilo.',
      },
      {
        name: 'Del Mar',
        price: 10900,
        description:
          'Salmón apanado en panko, ciboulette y queso crema, envuelto en palta fresca y coronado con emulsión de ciboulette y camarones en panko.',
        top: true,
      },
      {
        name: 'Chicken Guacamole',
        price: 8900,
        description:
          'Pollo apanado, queso crema y cebollín envuelto en alga nori tempurizada. Coronado con guacamole cremoso y nachos.',
      },
      {
        name: 'Beef Guacamole',
        price: 8900,
        description:
          'Churrasco y pimentón. Envuelto en nori apanado en panko. Cubierto de guacamole, nachos y un chorro de salsa cheddar.',
      },
      {
        name: 'Sex on the Beach',
        price: 10900,
        description:
          'Camarones apanados en panko y palta, envuelto en salmón flambeado. Bañado con mayo spicy, salsa de anguila, maracuyá y cebollín.',
      },
      {
        name: 'Salmón Tártaro',
        price: 9900,
        description:
          'Camarón apanado en panko y palta, envuelto en ciboulette y cubierto por un fresco tartar de salmón.',
      },
      {
        name: 'Chicken Maki (Hosomaki 6c)',
        price: 4900,
        description: 'Alga nori rellena con arroz de sushi, pollo, cebollín y queso crema.',
      },
      {
        name: 'Ebi Maki (Hosomaki 6c)',
        price: 4900,
        description: 'Alga nori rellena con arroz de sushi, palta, camarón furay y queso crema.',
      },
      {
        name: 'Sake Maki (Hosomaki 6c)',
        price: 4900,
        description: 'Alga nori rellena con arroz, salmón, palta y pimentón rojo.',
      },
      {
        name: 'Vegui Maki (Hosomaki 6c)',
        price: 4900,
        description: 'Alga nori rellena con arroz, palmito, pimentón, palta y cebolla morada.',
        vegan: true,
      },
      {
        name: 'California Vegano',
        price: 4900,
        description:
          'Palmito, palta, champiñón y pepino. Envuelto a tu elección (sésamo, ciboulette, merkén o Takis).',
        vegan: true,
      },
      {
        name: 'California Chicken Hass',
        price: 4900,
        description: 'Pollo, palta y cebollín envuelto a tu elección.',
      },
      {
        name: 'California Chicken Teriyaki',
        price: 5500,
        description: 'Pollo teriyaki de la casa, palta y queso philadelphia envuelto a elección.',
      },
      {
        name: 'Beef California',
        price: 5500,
        description: 'Churrasco de vacuno, palta y pimentón rojo envuelto a elección.',
      },
      {
        name: 'California Ebi',
        price: 5900,
        description: 'Camarón, palta y queso philadelphia envuelto a elección.',
      },
      {
        name: 'California Sake',
        price: 6500,
        description: 'Salmón, ciboulette y queso philadelphia envuelto a elección.',
      },
      {
        name: 'California Sake Ebi',
        price: 6900,
        description: 'Salmón, camarón, ciboulette y queso philadelphia envuelto a elección.',
      },
      {
        name: 'Vegui Hass (Envuelto Palta)',
        price: 4900,
        description: 'Champiñón furay, cebollín y queso philadelphia envuelto en palta.',
        vegan: true,
      },
      {
        name: 'Chicken Hass (Envuelto Palta)',
        price: 5900,
        description: 'Pollo, palta y cebollín envuelto en palta suave.',
      },
      {
        name: 'Chicken Teriyaki Hass (Envuelto Palta)',
        price: 6500,
        description: 'Pollo teriyaki saborizado, palta y queso philadelphia envuelto en palta.',
      },
      {
        name: 'Beef Hass (Envuelto Palta)',
        price: 6500,
        description: 'Carne de churrasco de vacuno, queso philadelphia y cebollín envuelto en palta.',
      },
      {
        name: 'Ebi Hass (Envuelto Palta)',
        price: 6900,
        description: 'Camarón furay en panko, queso crema y palta envuelto en palta.',
      },
      {
        name: 'Sake Hass (Envuelto Palta)',
        price: 7500,
        description: 'Salmón fresco, queso crema y cebollín envuelto en palta.',
      },
      {
        name: 'Sake Ebi Hass (Envuelto Palta)',
        price: 7900,
        description: 'Salmón, camarón seleccionado, queso crema y ciboulette envuelto en palta.',
      },
      {
        name: 'Passion Fruit (Envuelto Salmón)',
        price: 7900,
        description:
          'Camarón furay y queso philadelphia envuelto en salmón, acompañado de una dulce salsa de maracuyá.',
      },
      {
        name: 'Acevichado (Envuelto Salmón)',
        price: 8900,
        description:
          'Camarón furay, cebollín, pimentón y palta envuelto en salmón. Con un top de exquisita salsa acevichada.',
      },
      {
        name: 'Orange Green (Envuelto Salmón)',
        price: 8900,
        description:
          'Salmón apanado en panko, camarón, queso crema y palta envuelto en una equilibrada capa de salmón y palta con un toque de maracuyá.',
      },
      {
        name: 'Happy Vegui (Sin Arroz)',
        price: 6900,
        description:
          'Champiñón frito en panko, palmitos, queso crema y cebollín sin arroz, envuelto en palta.',
        vegan: true,
      },
      {
        name: 'Fresh Roll (Sin Arroz)',
        price: 6900,
        description: 'Palmito, queso crema, cebollín y pimentón sin arroz, envuelto en palta.',
      },
      {
        name: 'Hass Keto (Sin Arroz)',
        price: 7900,
        description:
          'Camarón furay, salmón fresco, palta y cebollín envuelto en queso philadelphia y decorado con papas hilo y salsa de maracuyá.',
      },
      {
        name: 'Cheese Tempura (Sin Arroz)',
        price: 8900,
        description:
          'Pollo teriyaki, cebolla morada y palta sin arroz, envuelto en una cubierta frita de queso crema tempura.',
      },
      {
        name: 'Ocean Keto (Sin Arroz)',
        price: 8900,
        description: 'Salmón, camarones, queso crema y cebollín sin arroz, envuelto en palta.',
      },
      {
        name: 'Salmón Keto (Sin Arroz)',
        price: 8900,
        description:
          'Camarón furay, palta, ciboulette y queso philadelphia envuelto en una capa de salmón apanado en panko y salsa tempura.',
      },
      {
        name: 'Frambuesita (Sin Arroz)',
        price: 8900,
        description:
          'Pollo teriyaki, palta, pimentón y cebollín envuelto en queso crema, decorado con almendras picantes y emulsión de frambuesas.',
      },
      {
        name: 'Tartar Roll (Sin Arroz)',
        price: 11900,
        description:
          'Roll sin arroz, relleno de queso crema, camarón y salmón, frito en tempura y coronado con un sabroso tartar de atún.',
        top: true,
      },
      {
        name: 'Vegui White (En Queso)',
        price: 6400,
        description: 'Champiñón furay, palta y cebollín envuelto en una suave capa de queso philadelphia.',
        vegan: true,
      },
      {
        name: 'Dolly (En Queso)',
        price: 6900,
        description:
          'Champiñón salteado, palta y cebollín envuelto en queso crema con un toque de almendras laminadas.',
      },
      {
        name: 'Chicken Cheese (En Queso)',
        price: 6500,
        description: 'Pollo apanado en panko, palta y cebollín envuelto en queso crema y papas hilo crujientes encima.',
      },
      {
        name: 'Chicken Teriyaki Cheese (En Queso)',
        price: 6900,
        description: 'Pollo teriyaki, palta y almendras tostadas envuelto en queso philadelphia y acompañado con salsa tempura.',
      },
      {
        name: 'Beef Cheese (En Queso)',
        price: 7900,
        description: 'Trozos de churrasco de vacuno, palta y cebollín envuelto en queso philadelphia y semillas de sésamo.',
      },
      {
        name: 'Ebi Cheese (En Queso)',
        price: 7400,
        description: 'Camarón, palta y cebollín envuelto en queso philadelphia con salsa tempura adicional.',
      },
      {
        name: 'Sake Cheese (En Queso)',
        price: 7900,
        description: 'Salmón fresco, palta y cebollín envuelto en queso philadelphia y merquén, ciboulette o sésamo.',
      },
      {
        name: 'Vegui Tempura (Fritos)',
        price: 4500,
        description: 'Palmito, palta, champiñón y pepino apanado en panko y frito. Con salsa tempura.',
        vegan: true,
      },
      {
        name: 'Champissión (Fritos)',
        price: 6900,
        description: 'Champiñón salteado, queso derretido y cebollín apanado en panko y bañado en salsa de huancaína.',
      },
      {
        name: 'Tori Roll (Fritos)',
        price: 4900,
        description: 'Pollo, cebollín y queso philadelphia, envuelto en panko con salsa tempura.',
      },
      {
        name: 'Chicken Olivo (Fritos)',
        price: 4900,
        description: 'Pollo apanado, aceitunas y queso crema envuelto en panko frito con salsa agridulce.',
      },
      {
        name: 'Chicken Hass Tempura (Fritos)',
        price: 4900,
        description: 'Pollo, palta y cebollín frito en crujiente panko con salsa tempura.',
      },
      {
        name: 'Chicken Teriyaki Tempura (Fritos)',
        price: 5500,
        description: 'Pollo teriyaki, palta y queso philadelphia apanado en panko con salsa tempura.',
      },
      {
        name: 'Beef Tempura (Fritos)',
        price: 5900,
        description: 'Churrasco de vacuno saborizado, queso philadelphia y palta apanado en panko crujiente.',
      },
      {
        name: 'Chicken Fruit (Fritos)',
        price: 6900,
        description: 'Pollo frito, palta y cebollín apanado en panko con una emulsión natural de maracuyá.',
      },
      {
        name: 'Ebi Tempura (Fritos)',
        price: 5900,
        description: 'Camarón, palta y queso philadelphia apanado en panko con salsa tempura.',
      },
      {
        name: 'Luco Tempura (Fritos)',
        price: 6500,
        description: 'Carne de churrasco, champiñón salteado y queso derretido envuelto en panko crujiente.',
      },
      {
        name: 'Sake Tempura (Fritos)',
        price: 6500,
        description: 'Salmón, cebollín y queso philadelphia apanado en panko frito con salsa tempura.',
      },
    ],
  },
  {
    id: 'shirashi',
    label: 'Shirashi Bowls',
    note: 'gohan bowls sobre base de arroz o lechuga',
    image: '/images/cat-shirashi.png',
    items: [
      {
        name: 'Shirashi Nikkei',
        price: 8900,
        description:
          'Base de arroz o lechuga fresca con ceviche Take\u2019s y papas hilo crujientes. Acompañado de adictiva salsa acevichada.',
      },
      {
        name: "Shirashi Take's",
        price: 7900,
        description:
          'Base de arroz o lechuga, con dados de salmón, kanikama, queso philadelphia cremoso, cebollín y sésamo. Con salsa acevichada.',
      },
      {
        name: 'Shirashi Molina',
        price: 7900,
        description:
          'Base de arroz o lechuga, acompañada de trozos de pollo y camarones apanados, queso crema, palta y lluvia de sésamo.',
        top: true,
      },
      {
        name: 'Shirashi Maule',
        price: 7900,
        description:
          'Base de arroz o lechuga, palmito fresco, palta, champiñones salteados, queso crema, cebollín e hilos de papas camote.',
      },
    ],
  },
  {
    id: 'promociones',
    label: "Promociones Take's",
    note: 'combos para compartir',
    image: '/images/promo-platter.png',
    items: [
      {
        name: "Take's 1 (16 cortes)",
        price: 12990,
        description: 'California chicken hass (8 cortes) + Sake maki (6 cortes) + Gyozas (2u).',
      },
      {
        name: "Take's 2 (30 cortes)",
        price: 19990,
        description:
          'California Ebi (8 cortes) + Sake maki (6 cortes) + Chicken Hass Tempura (8 cortes) + Gyozas (8u).',
      },
      {
        name: "Take's 3 (40 cortes)",
        price: 32990,
        description:
          'California Ebi (8) + Ebi Tempura (8) + Sake maki (6) + Passion Fruit (8) + Sake Hass (8) + Gyozas (2u).',
        top: true,
      },
      {
        name: "Take's 4 (50 cortes)",
        price: 39990,
        description:
          'Ebi Tempura (8) + Chicken Teriyaki Tempura (8) + California Chicken Hass (8) + Ebi maki (6) + Frambuesita (8) + Vegui maki (6) + Gyozas (6u).',
      },
      {
        name: "Take's Hot (3 rolls fritos)",
        price: 15490,
        description:
          'Chicken Rollo (pollo, cebollín, queso crema), Ebi (camarón, queso crema, champiñón), Sake (salmón, champiñón, queso crema). Todos fritos en tempura.',
      },
      {
        name: "Take's Veguie (30 cortes)",
        price: 15490,
        description: 'California vegano (8) + Vegui maki (6) + Vegui Tempura (8) + Vegui Hass (8).',
        vegan: true,
      },
      {
        name: "Take's 5 (70 cortes)",
        price: 41990,
        description:
          'Chicken Teriyaki Hass (8) + Passion Fruit (8) + Ebi Tempura (8) + Chicken Hass Tempura (8) + California Ebi (8) + Mayo maki (6) + Camarón Furay (10u) + Gyozas (14u).',
        top: true,
      },
    ],
  },
  {
    id: 'pizzas',
    label: 'Pizzas & Ceviches',
    note: 'a la piedra y frescos del mar',
    image: '/images/cat-pizzas-ceviches.png',
    items: [
      {
        name: 'Pizza Pepperoni',
        price: 9900,
        description: 'Salsa de tomates de la casa, queso mozzarella y pepperoni.',
      },
      {
        name: 'Pizza Pollo Choclo',
        price: 9900,
        description: 'Salsa de tomates, queso mozzarella, pollo desmenuzado, choclo y champiñón.',
      },
      {
        name: 'Pizza Camarones',
        price: 11900,
        description: 'Salsa de tomates, mozzarella, camarones seleccionados, albahaca fresca y salsa barbecue.',
      },
      {
        name: 'Pizza Serrana',
        price: 10900,
        description: 'Salsa de tomates, mozzarella, jamón serrano premium, tomates cherry dulces y rúcula.',
      },
      {
        name: 'Pizza 4 Estaciones',
        price: 11900,
        description: 'Lo mejor de nuestras cuatro variedades de pizza en una sola.',
        top: true,
      },
      {
        name: "Ceviche Take's",
        price: 11900,
        description: 'Preparación fresca de salmón y camarones, cebolla morada, pimentón y ciboulette.',
      },
      {
        name: 'Ceviche Roll',
        price: 10900,
        description:
          'Camarón furay y queso crema. Envuelto en palta suave y cubierto de nuestro ceviche de salmón.',
        top: true,
      },
    ],
  },
  {
    id: 'almuerzo',
    label: 'Almuerzos',
    note: 'disponible de 12:30 a 16:00 hrs',
    image: '/images/cat-almuerzo.png',
    items: [
      {
        name: 'Salmón a la plancha',
        price: 9900,
        description:
          'Delicioso corte de salmón. Acompáñalo con papas rústicas, hojas verdes o arroz con palta.',
      },
      {
        name: 'Pollo a la plancha',
        price: 7900,
        description:
          'Pechuga de pollo a la plancha bien sazonada. Acompáñalo con papas rústicas, hojas verdes o arroz con palta.',
      },
      {
        name: 'Fideos de Arroz Vegetarianos',
        price: 5900,
        description: 'Fideos de arroz salteados al wok con verduras variadas de temporada.',
        vegan: true,
      },
      {
        name: 'Fideos de Arroz Pollo / Champiñón',
        price: 6900,
        description:
          'Fideos al wok en una rica salsa blanca con pollo y champiñones, coronados con tocino crocante y cebollín.',
      },
      {
        name: 'Fideos de Arroz Camarón',
        price: 7900,
        description:
          'Fideos de arroz al wok acompañados de camarones salteados en salsa de morrón rojo y crema de coco.',
      },
    ],
  },
  {
    id: 'ensaladas',
    label: 'Ensaladas, Fajitas & Quesadillas',
    note: 'frescas y para compartir',
    image: '/images/cat-ensaladas-fajitas.png',
    items: [
      {
        name: 'Ensalada Serrana',
        price: 6900,
        description:
          'Mix de lechuga fresca y rúcula silvestre, jamón serrano crujiente, tomates cherry frescos y queso parmesano. Con aderezo mostaza miel.',
      },
      {
        name: 'Ensalada Fresh',
        price: 5900,
        description:
          'Base de lechuga fresca, a elección con pollo asado o atún desmenuzado, tomate cherry, palta suave y dados de queso crema.',
      },
      {
        name: 'Ensalada Camarón',
        price: 6900,
        description:
          'Base fresca de lechuga y rúcula, trozos de queso crema, deliciosos camarones salteados, palta y sésamo mix.',
      },
      {
        name: 'Fajita Vegui',
        price: 5900,
        description:
          'Dos tortillas de trigo con champiñones, pimentón y cebolla salteada al wok, lechuga fresca, guacamole cremoso y salsa de ciboulette.',
        vegan: true,
      },
      {
        name: 'Fajita Chicken',
        price: 5900,
        description:
          'Tortilla con pollo jugoso, lechuga, tomate, choclo dulce y guacamole casero. Con aderezo mostaza miel.',
      },
      {
        name: 'Fajita Chacarera',
        price: 5900,
        description:
          'Fajita rellena con churrasco de vacuno tierno, tomate fresco, lechuga, porotos verdes crujientes y ají verde.',
      },
      {
        name: 'Quesadilla Pochoclo',
        price: 5900,
        description: 'Tortilla de trigo tostada y doblada rellena de queso derretido, pollo y choclo.',
      },
      {
        name: 'Quesadilla Napolitana',
        price: 5900,
        description:
          'Tortilla de trigo con queso derretido, jamón de cerdo, tomate, aceitunas negras y un toque de orégano silvestre.',
      },
      {
        name: 'Quesadilla Camarón',
        price: 6900,
        description:
          'Tortilla de trigo con queso mozzarella, camarones y un salteado oriental de cebollín y pimentón.',
      },
    ],
  },
  {
    id: 'tostadas',
    label: 'Tostadas, Sandwiches & Desayunos',
    note: 'escoge tu pan: molde o masa madre',
    image: '/images/cat-sandwiches.png',
    items: [
      {
        name: 'Tostada Simple',
        price: 2500,
        description: 'Escoge tu pan (molde o masa madre). Incluye porción de mantequilla y mermelada.',
      },
      { name: 'Aliado', price: 3000, description: 'Sándwich de jamón y queso fundido.' },
      {
        name: 'Tostadas con huevo',
        price: 3500,
        description: 'Escoge tu pan. Incluye 3 huevos revueltos. Agrega tocino por +$1.500.',
      },
      {
        name: 'Tostada con palta',
        price: 3500,
        description: 'Base de mantequilla con palta molida y sésamo mix.',
        vegan: true,
      },
      {
        name: 'Tostada palta y jamón',
        price: 4000,
        description: 'Base de mantequilla, palta molida y jamón.',
      },
      {
        name: 'Tostada pochada',
        price: 5900,
        description: 'Base de mantequilla, palta y huevo pochado.',
        top: true,
      },
      { name: 'Ave Mayo', price: 4000, description: 'Pasta cremosa de ave desmenuzada y mayonesa.' },
      {
        name: 'Sándwich Molina',
        price: 5900,
        description: 'Queso fresco, jamón de pavo acaramelado, tomate, lechuga y salsa de ciboulette.',
      },
      {
        name: 'Sándwich Radal',
        price: 6900,
        description: 'Jamón serrano, queso crema, rúcula y un toque de mermelada de cebolla.',
      },
      {
        name: 'Churrasco Chacarero',
        price: 6900,
        description: 'Churrasco de vacuno, tomate, porotos verdes y ají verde.',
      },
      { name: 'Barros Luco', price: 5900, description: 'Churrasco de vacuno con queso fundido.' },
      {
        name: 'Churrasco Italiano',
        price: 6900,
        description: 'Churrasco de vacuno, palta, tomate y mayonesa.',
      },
      {
        name: 'Panini Napolitano',
        price: 5900,
        description:
          'Queso fundido, jamón de pavo, tomate, aceitunas negras y orégano en panini grillado.',
        top: true,
      },
      {
        name: 'Reineta Tártara',
        price: 9900,
        description:
          'Reineta frita en pan ciabatta con lechuga, palta, cebolla morada y salsa tártara. Con papas fritas.',
      },
      {
        name: 'A lo pobre',
        price: 9900,
        description:
          'Bistec de vacuno en pan ciabatta con cebolla caramelizada y huevo frito. Con papas fritas.',
      },
      {
        name: 'Luco Champiñón',
        price: 9900,
        description:
          'Bistec de vacuno en pan ciabatta con queso fundido, champiñones salteados y palta. Con papas fritas.',
      },
      {
        name: 'Promo Desayuno 1',
        price: 5000,
        description:
          'Té de hoja o café (Americano, cortado o capuccino) + paila de huevos o planchado de jamón y queso. Hasta las 11:59 hrs.',
      },
      {
        name: 'Promo Desayuno 2',
        price: 6900,
        description:
          'Té de hoja o café (Americano, cortado o capuccino) + trozo de torta. Hasta las 11:59 hrs.',
      },
    ],
  },
  {
    id: 'cafeteria',
    label: 'Cafetería',
    note: 'café de especialidad, tés y chocolates',
    image: '/images/coffee.png',
    promo: {
      title: 'Agrega syrup o leche vegetal',
      highlight: '$700',
      sub: 'Y disfrútalo como más te guste',
    },
    items: [
      { name: 'Espreso', price: 2800, description: 'Extracción concentrada de café.' },
      { name: 'Americano', price: 3100, description: 'Espresso diluido con agua.' },
      { name: 'Macchiato', price: 3000, description: 'Espresso manchado con leche.' },
      { name: 'Cortado', price: 3500, description: 'Espresso simple con leche en taza de 150 ml.' },
      { name: 'Capuccino', price: 2600, description: 'Espresso simple con leche en taza de 150 ml.' },
      { name: 'Latte', price: 3400, description: 'Espresso simple con leche en taza de 300 ml.' },
      {
        name: 'Bombón',
        price: 3800,
        description: 'Espresso doble con base de leche condensada y leche emulsionada.',
      },
      {
        name: 'Mokaccino',
        price: 4300,
        description: 'Espresso doble con leche y cacao en polvo en taza de 300 ml.',
      },
      { name: 'Moka Blanco', price: 4600, description: 'Espresso doble con leche y chocolate blanco.' },
      {
        name: 'Terragoloso',
        price: 4000,
        description:
          'Espresso con base de manjar, salsa de chocolate, leche, espuma de leche y salsa de manjar.',
        top: true,
      },
      {
        name: 'After Eight',
        price: 4800,
        description: 'Espresso con salsa de chocolate, syrup de menta y leche emulsionada.',
      },
      {
        name: 'Romance',
        price: 4800,
        description: 'Espresso con salsa de frambuesa, cacao espolvoreado y crema batida.',
      },
      { name: 'Té Variedades', price: 1900, description: 'Variedad de tés seleccionados.' },
      { name: 'Té con Leche', price: 2900, description: 'Té servido con leche emulsionada.' },
      { name: 'Té de Hojas', price: 2300, description: 'Infusión tradicional de hojas de té.' },
      {
        name: 'Chai Latte',
        price: 3900,
        description: 'Infusión de té negro y especias aromáticas, emulsionado con leche.',
      },
      {
        name: 'Matcha Latte',
        price: 3500,
        description: 'Té matcha energizante, desintoxicante, estimulante y delicioso.',
      },
      { name: 'Chocolate Caliente', price: 3800, description: 'Cacao dulce con leche texturizada.' },
      {
        name: 'Chocolate Caliente Americano',
        price: 4300,
        description: 'Cacao dulce con leche texturizada, coronado con crema chantilly.',
      },
      {
        name: 'Chocolate Caliente de la Casa',
        price: 4300,
        description: 'Cacao dulce con leche texturizada, coronado con marshmallow.',
        top: true,
      },
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas, Cócteles & Mocktails',
    note: 'happy hour de lunes a sábado, 17:00 a 19:00 hrs',
    image: '/images/cat-mocktails.png',
    promo: {
      title: 'Happy Hour · Lunes a Sábado · 17:00 — 19:00 hrs',
      highlight: '2 x $9.990',
      sub: 'Aperol, Ramazzotti, Mojito o Mojitos sabores',
    },
    items: [
      { name: 'Agua mineral con/sin gas', price: 1900, description: 'Agua mineral embotellada.' },
      { name: 'Bebidas', price: 2200, description: 'Gaseosas de variedades.' },
      { name: 'Jugos Naturales', price: 3500, description: 'Exprimidos naturales del día.' },
      { name: 'Limonada', price: 3500, description: 'Limonada casera tradicional con hielo.' },
      {
        name: 'Limonada menta y/o jengibre',
        price: 3800,
        description: 'Limonada casera saborizada con menta fresca y/o jengibre.',
      },
      { name: 'Cerveza botellín 330cc', price: 3900, description: 'Cerveza en formato botellín personal.' },
      { name: 'Schop Artesanal', price: 3900, description: 'Cerveza artesanal de barril tirada.' },
      { name: 'Schop CCU', price: 4500, description: 'Schop tradicional de marcas seleccionadas.' },
      {
        name: 'Mojito Corona',
        price: 7500,
        description: 'Refrescante mojito acompañado de cerveza Corona.',
      },
      { name: 'Mojito Sabores', price: 5900, description: 'Mojito clásico con opción de pulpa de frutas.' },
      { name: 'Mojito Jaeger', price: 8900, description: 'Mojito especial adicionado con Jagermeister.' },
      { name: 'Mojito Blue', price: 7500, description: 'Mojito preparado con Curacao azul.' },
      {
        name: 'Misiones de Rengo 187cc',
        price: 3900,
        description: 'Vino tinto/blanco en formato personal de 187cc.',
      },
      { name: 'Copa Sangría Victoria', price: 5900, description: 'Copa de sangría casera receta especial.' },
      {
        name: 'Jarra Sangría Victoria',
        price: 11900,
        description: 'Jarra ideal para compartir sangría casera.',
      },
      {
        name: 'Aperol Spritz',
        price: 6900,
        description: 'Aperol, espumante, agua de soda y rodaja de naranja.',
      },
      {
        name: 'Ramazzotti Spritz',
        price: 6900,
        description: 'Licores de flor de hibisco y azahar combinados con espumante.',
      },
      {
        name: 'Piscola Alto del Carmen 35°',
        price: 5500,
        description: 'Destilado nacional servido con bebida cola y hielo.',
      },
      {
        name: 'Piscola Mistral 35°',
        price: 5500,
        description: 'Pisco Mistral añejado en barricas de roble.',
      },
      {
        name: 'Piscola Mistral Nobel',
        price: 6500,
        description: 'Pisco premium Mistral Nobel con bebida y hielo.',
      },
      { name: 'Espumante Aresti 187cc', price: 4900, description: 'Botella individual de espumante Aresti.' },
      { name: 'Frambuesa Ice', price: 4900, description: 'Preparación fría y frutal dulce de frambuesas.' },
      {
        name: 'Tropical Gin',
        price: 8500,
        description: 'Gin premium combinado con bebidas tropicales o energéticas.',
      },
      {
        name: 'Espresso Martini',
        price: 6900,
        description: 'Cóctel sofisticado con vodka, licor de café y un shot de espresso.',
        top: true,
      },
      {
        name: 'Tequila Margarita',
        price: 6500,
        description: 'Tequila de la casa con triple sec y jugo de limón fresco.',
      },
      { name: 'Ramazzotti Sour', price: 4900, description: 'Exquisita versión sour de la flor de hibisco.' },
      { name: 'Limonada Honey', price: 7500, description: 'Limonada fresca endulzada con miel natural.' },
      {
        name: 'Ruso Blanco',
        price: 7500,
        description: 'Vodka, licor de café y crema de leche o leche emulsionada.',
      },
      {
        name: 'Pisco Sour',
        price: 4500,
        description: 'Preparación batida tradicional con pisco, limón y jarabe de goma.',
      },
      {
        name: 'Piña Colada',
        price: 5900,
        description: 'Cóctel dulce a base de ron, crema de coco y jugo de piña.',
      },
      {
        name: 'Whiskola Chivas',
        price: 9900,
        description: 'Whisky Chivas Regal combinado con bebida de cola y hielo.',
      },
      {
        name: 'Whiscola Johnnie Walker',
        price: 8500,
        description: 'Whisky Johnnie Walker combinado con bebida de cola y hielo.',
      },
      {
        name: 'Espresso Tonic',
        price: 4900,
        description: 'Bebida tónica con shot doble de espresso y hielo.',
      },
      {
        name: 'Orange Coffee',
        price: 4900,
        description: 'Jugo de naranja natural con shot doble de espresso y hielo.',
      },
      { name: 'Iced Latte', price: 4000, description: 'Espresso doble con leche fría y hielo.' },
      { name: 'Iced Matcha Latte', price: 4900, description: 'Shot de matcha, leche fría y hielo.' },
      {
        name: 'Iced Matcha Sabores',
        price: 5900,
        description: 'Shot de matcha, leche, pulpa de fruta (mango o frambuesa) y hielo.',
      },
    ],
  },
  {
    id: 'postres',
    label: 'Postres & Pastelería',
    note: 'tortas, waffles y dulces',
    image: '/images/cat-postres.png',
    items: [
      {
        name: "Fondue Take's",
        price: 10990,
        description:
          'Fuente de chocolate caliente con frutas de la estación, mix de galletas, trozos de waffles belgas y marshmallows.',
        top: true,
      },
      { name: 'Media Luna', price: 990, description: 'Media luna horneada clásica estilo argentino.' },
      { name: 'Cinnamon Roll', price: 2500, description: 'Rollo de canela tibio con glaseado cremoso.' },
      { name: 'Muffin', price: 2500, description: 'Quequito esponjoso de vainilla o chocolate.' },
      {
        name: 'Macarones (3u)',
        price: 3900,
        description: 'Tres tradicionales macarrones franceses de distintos sabores.',
      },
      {
        name: 'Pie de Limón',
        price: 3900,
        description: 'Pie con base crujiente, crema ácida de limón y merengue tostado.',
      },
      {
        name: 'Cheesecake',
        price: 4900,
        description: 'Tarta fría de queso crema con salsa de frutos rojos o maracuyá.',
      },
      { name: 'Torta', price: 4900, description: 'Trozo de torta tradicional del día a elección de la vitrina.' },
      {
        name: 'Torta Sin Azúcar',
        price: 5900,
        description: 'Trozo de torta apta para dietas restringidas en azúcar, endulzada de manera saludable.',
      },
      {
        name: 'Waffles con Helado',
        price: 5900,
        description: 'Waffle belga casero caliente con helado artesanal, frutos rojos y salsa.',
      },
      {
        name: 'Waffles Banana Split',
        price: 8900,
        description: 'Waffle con dos bolas de helado, plátano en rebanadas, salsa de manjar y crema chantilly.',
      },
      {
        name: 'Volcán de Chocolate',
        price: 6900,
        description: 'Bizcocho con centro de chocolate fundido caliente, helado de vainilla y crema chantilly.',
      },
      {
        name: 'Brownie con Helado',
        price: 5900,
        description: 'Brownie de chocolate fudge con helado, salsa de chocolate y frutos rojos.',
      },
      {
        name: 'Tostadas Francesas',
        price: 5900,
        description: 'Tostadas esponjosas de pan brioche bañadas en syrup de maple, fruta del día y azúcar flor.',
      },
    ],
  },
]

const VEGAN_ITEMS: MenuItemWithCategory[] = categories.flatMap((cat) =>
  cat.items.filter((item) => item.vegan).map((item) => ({ ...item, categoryId: cat.id })),
)

// Pestaña anexa que reúne todas las opciones veganas de toda la carta en un
// solo lugar — no es una categoría real propia (no tiene sección en el
// pedido de WhatsApp), es solo una vista filtrada de las categorías de
// arriba. Por eso no se agrega a `categories`, solo a `allCategories` más
// abajo (usado para las pestañas y el banner, nunca para agrupar el pedido).
const VEGAN_CATEGORY_ID = 'vegano'

const veganCategory: Category = {
  id: VEGAN_CATEGORY_ID,
  label: 'Vegano',
  note: `${VEGAN_ITEMS.length} opciones 100% veganas de toda la carta`,
  image: '/images/cat-sushi-rolls.png',
  items: VEGAN_ITEMS,
}

const allCategories: Category[] = [veganCategory, ...categories]

function Badges({ item }: { item: MenuItem }) {
  if (!item.top && !item.vegan) return null
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {item.top && (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-accent-foreground">
          <Flame className="h-3 w-3" /> Top
        </span>
      )}
      {item.vegan && (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-brand-foreground">
          <Leaf className="h-3 w-3" /> Veggie
        </span>
      )}
    </span>
  )
}

function QuantityControl({
  qty,
  onAdd,
  onRemove,
  label,
}: {
  qty: number
  onAdd: () => void
  onRemove: () => void
  label: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border p-1 transition-colors',
        qty > 0 ? 'border-brand bg-brand/10' : 'border-border bg-card',
      )}
    >
      <button
        type="button"
        onClick={onRemove}
        disabled={qty === 0}
        aria-label={`Quitar una unidad de ${label}`}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
          qty === 0
            ? 'cursor-not-allowed text-muted-foreground/40'
            : 'text-foreground hover:bg-brand hover:text-brand-foreground',
        )}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className={cn(
          'w-6 text-center text-sm font-bold tabular-nums',
          qty > 0 ? 'text-brand' : 'text-muted-foreground',
        )}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Agregar una unidad de ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground transition-colors hover:bg-brand/85"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

function ListLayout({
  items,
  getQty,
  onAdd,
  onRemove,
}: {
  items: MenuItemWithCategory[]
  getQty: (id: string) => number
  onAdd: (id: string, item: MenuItem, categoryId: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="mt-10 grid gap-x-12 gap-y-1 md:grid-cols-2">
      {items.map((item, i) => {
        const id = `${item.categoryId}__${item.name}`
        const qty = getQty(id)
        return (
          <Reveal key={id} delay={(i % 2) * 60}>
            <div
              className={cn(
                'group border-b py-4 transition-colors',
                qty > 0 ? 'border-brand/50' : 'border-border/70 hover:border-brand/40',
              )}
            >
              <div className="flex items-baseline gap-3">
                <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                  {item.name}
                  <Badges item={item} />
                </h3>
                <span
                  className="mx-2 hidden flex-1 translate-y-[-3px] border-b border-dashed border-border sm:block"
                  aria-hidden="true"
                />
                <span className="ml-auto shrink-0 text-base font-extrabold text-brand sm:ml-0">
                  {formatPrice(item.price)}
                </span>
              </div>
              {item.description && (
                <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
              <div className="mt-3">
                <QuantityControl
                  qty={qty}
                  label={item.name}
                  onAdd={() => onAdd(id, item, item.categoryId)}
                  onRemove={() => onRemove(id)}
                />
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

function PromoBanner({ promo }: { promo: Promo }) {
  return (
    <Reveal className="mt-10">
      <div className="flex flex-col items-center gap-2 rounded-3xl bg-accent px-6 py-7 text-center text-accent-foreground shadow-lg shadow-accent/25 sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em]">{promo.title}</p>
          {promo.detail && <p className="mt-1 text-sm font-medium opacity-90">{promo.detail}</p>}
          {promo.sub && <p className="mt-1 text-sm font-medium opacity-90">{promo.sub}</p>}
        </div>
        {promo.highlight && (
          <span className="text-3xl font-extrabold sm:text-4xl">{promo.highlight}</span>
        )}
      </div>
    </Reveal>
  )
}

type CartEntry = {
  name: string
  price: number
  categoryId: string
  categoryLabel: string
  qty: number
}

function MenuGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <Reveal className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
      <a
        href={TOTEAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-4 rounded-3xl border-2 border-border bg-card p-8 text-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-2xl"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
          <Store className="h-8 w-8" />
        </span>
        <span className="text-lg font-extrabold uppercase tracking-wide text-foreground">
          Carta para consumir en local
        </span>
        <span className="text-sm text-muted-foreground">
          Ábrela en Toteat y pide directo desde tu mesa
        </span>
      </a>

      <button
        type="button"
        onClick={onUnlock}
        className="group flex flex-col items-center gap-4 rounded-3xl border-2 border-border bg-card p-8 text-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-2xl"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <Bike className="h-8 w-8" />
        </span>
        <span className="text-lg font-extrabold uppercase tracking-wide text-foreground">
          Pedir para delivery
        </span>
        <span className="text-sm text-muted-foreground">
          Arma tu pedido y elige retiro o despacho
        </span>
      </button>
    </Reveal>
  )
}

type DeliveryMethod = 'retiro' | 'delivery'

// `price: null` marca "Otro sector" — no tiene tarifa fija, así que el
// costo queda "a confirmar por WhatsApp" en vez de sumarse al total.
const SECTORES_DELIVERY: { id: string; label: string; price: number | null }[] = [
  { id: 'molina-urbano', label: 'Molina Urbano', price: 1000 },
  { id: 'casa-blanca', label: 'Casa Blanca', price: 4000 },
  { id: 'pichingal', label: 'Pichingal', price: 6000 },
  { id: 'cerrillo-bascunan', label: 'Cerrillo Bascuñán', price: 7000 },
  { id: 'bajo-los-romeros', label: 'Bajo Los Romeros', price: 6000 },
  { id: 'san-jorge-de-romeral', label: 'San Jorge de Romeral', price: 9000 },
  { id: 'otro', label: 'Otro sector', price: null },
]

function CheckoutModal({
  open,
  onClose,
  totalItems,
  totalPrice,
  deliveryMethod,
  onSelectMethod,
  sectorId,
  onSelectSector,
  otroDetalle,
  onChangeOtroDetalle,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  totalItems: number
  totalPrice: number
  deliveryMethod: DeliveryMethod | null
  onSelectMethod: (method: DeliveryMethod) => void
  sectorId: string | null
  onSelectSector: (id: string) => void
  otroDetalle: string
  onChangeOtroDetalle: (value: string) => void
  onConfirm: () => void
}) {
  if (!open) return null

  const selectedSector = SECTORES_DELIVERY.find((s) => s.id === sectorId) ?? null
  const esOtroSector = selectedSector?.id === 'otro'
  const deliveryFee = deliveryMethod === 'delivery' && selectedSector?.price ? selectedSector.price : 0
  const grandTotal = totalPrice + deliveryFee
  const canConfirm =
    deliveryMethod === 'retiro' ||
    (deliveryMethod === 'delivery' &&
      selectedSector !== null &&
      (!esOtroSector || otroDetalle.trim().length > 0))

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Elige cómo quieres recibir tu pedido"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-center text-xl font-extrabold text-foreground sm:text-2xl">
          ¿Retiro o delivery?
        </h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Elige cómo quieres recibir tu pedido.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelectMethod('retiro')}
            className={cn(
              'rounded-2xl border-2 p-4 text-center transition-all duration-200',
              deliveryMethod === 'retiro'
                ? 'border-brand bg-brand/10'
                : 'border-border bg-secondary/40 hover:border-brand/40',
            )}
          >
            <span className="block text-sm font-extrabold text-foreground">Retiro en local</span>
            <span className="mt-1 block text-xs text-muted-foreground">Sin costo adicional</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectMethod('delivery')}
            className={cn(
              'rounded-2xl border-2 p-4 text-center transition-all duration-200',
              deliveryMethod === 'delivery'
                ? 'border-brand bg-brand/10'
                : 'border-border bg-secondary/40 hover:border-brand/40',
            )}
          >
            <span className="block text-sm font-extrabold text-foreground">Delivery</span>
            <span className="mt-1 block text-xs text-muted-foreground">Según tu sector</span>
          </button>
        </div>

        {deliveryMethod === 'delivery' && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Elige tu sector
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {SECTORES_DELIVERY.map((sector) => (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => onSelectSector(sector.id)}
                  className={cn(
                    'flex items-center justify-between rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-all duration-200',
                    sectorId === sector.id
                      ? 'border-brand bg-brand/10 text-foreground'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:border-brand/40',
                  )}
                >
                  <span className="font-semibold">{sector.label}</span>
                  <span className="font-bold text-brand">
                    {sector.price !== null ? formatPrice(sector.price) : 'A confirmar'}
                  </span>
                </button>
              ))}
            </div>

            {esOtroSector && (
              <div className="mt-3 space-y-1.5">
                <label htmlFor="otro-detalle" className="text-xs font-semibold text-muted-foreground">
                  Cuéntanos tu dirección o sector
                </label>
                <input
                  id="otro-detalle"
                  value={otroDetalle}
                  onChange={(e) => onChangeOtroDetalle(e.target.value)}
                  placeholder="Ej. Calle Los Aromos 123, Molina"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
                <p className="text-xs text-muted-foreground">
                  El costo de delivery para tu sector se confirma por WhatsApp.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 space-y-1 rounded-2xl bg-secondary/40 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          {deliveryMethod === 'delivery' && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Delivery{selectedSector ? ` · ${selectedSector.label}` : ''}</span>
              <span>
                {selectedSector
                  ? selectedSector.price !== null
                    ? formatPrice(selectedSector.price)
                    : 'A confirmar'
                  : '—'}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 text-base font-extrabold text-foreground">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
          {esOtroSector && (
            <p className="pt-1 text-[0.7rem] text-muted-foreground">
              No incluye el costo de delivery, que se confirma por WhatsApp.
            </p>
          )}
        </div>

        <Button
          variant="brand"
          size="pill-lg"
          onClick={onConfirm}
          disabled={!canConfirm}
          className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirmar y enviar por WhatsApp
        </Button>
      </div>
    </div>
  )
}

export function MenuSection({ whatsappNumber }: { whatsappNumber: string }) {
  const [unlocked, setUnlocked] = useState(false)
  const [active, setActive] = useState(categories[0].id)
  const [cart, setCart] = useState<Record<string, CartEntry>>({})
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Si llegaste acá desde el modal "Pedir para delivery" (hero/nav/footer),
  // ya elegiste tu modalidad — evita preguntarte de nuevo.
  useEffect(() => {
    if (window.sessionStorage.getItem(MENU_UNLOCK_KEY) === '1') {
      window.sessionStorage.removeItem(MENU_UNLOCK_KEY)
      setUnlocked(true)
    }
    const onUnlockEvent = () => setUnlocked(true)
    window.addEventListener(MENU_UNLOCK_EVENT, onUnlockEvent)
    return () => window.removeEventListener(MENU_UNLOCK_EVENT, onUnlockEvent)
  }, [])
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null)
  const [sectorId, setSectorId] = useState<string | null>(null)
  const [otroDetalle, setOtroDetalle] = useState('')
  const current = allCategories.find((c) => c.id === active) ?? allCategories[0]
  // La pestaña "Vegano" ya trae sus ítems con `categoryId` propio (uno por
  // cada categoría real de origen); las demás pestañas son de una sola
  // categoría, así que se les agrega el mismo categoryId a todos sus ítems.
  const currentItems: MenuItemWithCategory[] =
    current.id === VEGAN_CATEGORY_ID
      ? (current.items as MenuItemWithCategory[])
      : current.items.map((item) => ({ ...item, categoryId: current.id }))

  const getQty = (id: string) => cart[id]?.qty ?? 0

  const addItem = (id: string, item: MenuItem, categoryId: string) => {
    const categoryLabel = categories.find((c) => c.id === categoryId)?.label ?? ''
    setCart((prev) => {
      const existing = prev[id]
      return {
        ...prev,
        [id]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { name: item.name, price: item.price, categoryId, categoryLabel, qty: 1 },
      }
    })
  }

  const removeItem = (id: string) => {
    setCart((prev) => {
      const existing = prev[id]
      if (!existing) return prev
      if (existing.qty <= 1) {
        const { [id]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: { ...existing, qty: existing.qty - 1 } }
    })
  }

  const clearCart = () => setCart({})

  const entries = useMemo(() => Object.values(cart).filter((e) => e.qty > 0), [cart])
  const totalItems = useMemo(() => entries.reduce((sum, e) => sum + e.qty, 0), [entries])
  const totalPrice = useMemo(
    () => entries.reduce((sum, e) => sum + e.qty * e.price, 0),
    [entries],
  )

  const selectedSector = SECTORES_DELIVERY.find((s) => s.id === sectorId) ?? null
  const deliveryFee = deliveryMethod === 'delivery' && selectedSector?.price ? selectedSector.price : 0
  const grandTotal = totalPrice + deliveryFee

  const sendOrder = () => {
    if (entries.length === 0) return

    // Agrupar por categoría respetando el orden de la carta
    const lines: string[] = ['*NUEVO PEDIDO - SUSHI TAKE\u2019S*', '']
    for (const cat of categories) {
      const catEntries = entries.filter((e) => e.categoryId === cat.id)
      if (catEntries.length === 0) continue
      lines.push(`*${cat.label}*`)
      for (const e of catEntries) {
        lines.push(`• ${e.qty}x ${e.name} — ${formatPrice(e.price * e.qty)}`)
      }
      lines.push('')
    }
    lines.push(
      `*Subtotal (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}): ${formatPrice(totalPrice)}*`,
    )
    if (deliveryMethod === 'retiro') {
      lines.push('*Modalidad: Retiro en local*')
    } else if (deliveryMethod === 'delivery' && selectedSector) {
      if (selectedSector.price !== null) {
        lines.push(`*Modalidad: Delivery en ${selectedSector.label}*`)
        lines.push(`*Costo delivery: ${formatPrice(selectedSector.price)}*`)
      } else {
        lines.push(`*Modalidad: Delivery — Otro sector*`)
        lines.push(`*Dirección/sector: ${otroDetalle.trim()}*`)
        lines.push('*Costo delivery: A confirmar por WhatsApp*')
      }
    }
    lines.push(`*Total a pagar: ${formatPrice(grandTotal)}*`)
    if (deliveryMethod === 'delivery' && selectedSector?.price === null) {
      lines.push('_(no incluye el costo de delivery, se confirma por WhatsApp)_')
    }

    const message = encodeURIComponent(lines.join('\n'))
    setCheckoutOpen(false)
    celebrate()
    // Deja ver la ráfaga de confetti un instante antes de saltar a WhatsApp
    // (que le quita el foco a esta pestaña) — si abriera al toque, casi
    // nadie llegaría a verla.
    window.setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }, 500)
  }

  return (
    <section
      id="carta"
      className={cn('relative bg-secondary/40 py-20 sm:py-28', totalItems > 0 && 'pb-32 sm:pb-36')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-eyebrow">Nuestra carta</span>
          <h2 className="text-h2 mt-3">Explora nuestro menú</h2>
          <p className="text-lead mt-4">
            {unlocked
              ? 'Sushi preparado al momento, café de especialidad, tostones, sandwiches y coctelería. Elige una categoría y descubre todo lo que tenemos para ti.'
              : 'Elige cómo quieres disfrutar tu pedido.'}
          </p>
        </Reveal>

        {!unlocked ? (
          <MenuGate onUnlock={() => setUnlocked(true)} />
        ) : (
          <>
            {/* Category tabs — el fondo activo es un solo elemento compartido
                (layoutId) que Framer Motion desliza entre pestañas en vez de
                aparecer/desaparecer de golpe en cada botón. */}
            <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    'group relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
                    active === cat.id
                      ? 'text-brand-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {active === cat.id ? (
                    <motion.span
                      layoutId="menu-category-pill"
                      className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-full bg-card transition-colors group-hover:bg-brand/10" />
                  )}
                  <span className="relative">{cat.label}</span>
                </button>
              ))}
            </Reveal>

            {/* Category banner */}
            <Reveal className="mt-10">
              <div className="relative overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/7] w-full sm:aspect-[16/5]">
                  <Image
                    src={current.image || '/placeholder.svg'}
                    alt={current.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">{current.label}</h3>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-white/85">
                    {current.note}
                  </p>
                </div>
              </div>
            </Reveal>

            <ListLayout
              items={currentItems}
              getQty={getQty}
              onAdd={addItem}
              onRemove={removeItem}
            />

            {current.promo && <PromoBanner promo={current.promo} />}
          </>
        )}
      </div>

      {/* Barra de pedido flotante */}
      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl shadow-black/20 backdrop-blur sm:gap-4 sm:p-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] font-bold text-accent-foreground">
                {totalItems}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu pedido
              </p>
              <p className="text-lg font-extrabold tabular-nums text-foreground">
                {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              type="button"
              onClick={clearCart}
              aria-label="Vaciar pedido"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <Button
              variant="brand"
              size="pill"
              onClick={() => setCheckoutOpen(true)}
              className="shrink-0"
            >
              Realizar Pedido
            </Button>
          </div>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        totalItems={totalItems}
        totalPrice={totalPrice}
        deliveryMethod={deliveryMethod}
        onSelectMethod={setDeliveryMethod}
        sectorId={sectorId}
        onSelectSector={setSectorId}
        otroDetalle={otroDetalle}
        onChangeOtroDetalle={setOtroDetalle}
        onConfirm={sendOrder}
      />
    </section>
  )
}
