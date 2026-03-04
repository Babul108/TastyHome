import React from 'react'
import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import FeaturedRestaurants from '../components/home/FeaturedRestaurants'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedRestaurants />
    </div>
  )
}
