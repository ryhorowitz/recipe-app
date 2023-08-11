import React, { useContext, useEffect, useState } from "react"
import UserContext from "../AppContext"

function UserMealsList() {
  const { user, setUser } = useContext(UserContext)
  const [mealRecipes, setMealRecipes] = useState([])

  function handleDelete(id, meal_type) {
    console.log('id is', id)
    fetch(`/recipes/${id}`, { method: 'DELETE' })
      .then(() => {
        // then remove recipe form user.recipes array
        // setUser is correctly running but is not rendering the page
        setUser({
          ...user,
          recipes: filterOutDeletedRecipe(id)
        })
      })
      .then(() => {
        console.log('filterRecipesByMeal block')
        filterRecipesByMeal(meal_type, id)
      })
      .catch((e) => console.error('error is ', e.message))
  }
  function filterOutDeletedRecipe(id) {
    return user.recipes.filter(recipe => recipe.id !== id)
  }
  async function handleUpdate(id) {
    await fetch(`/recipes/${id}`, {
      method: 'UPDATE',
      header: {
        "Content-Type": "apllication/json"
      },
      body: JSON.stringify('create update form')
    })
  }
  function filterRecipesByMeal(mealName, id) {
    // if statement filters after deletion of recipe
    if (id) {
      const filteredRecipes = mealRecipes.filter(recipe => {
        return recipe.id !== id
      })
      console.log('in filter RecipesByMEal if Block', filteredRecipes)
      setMealRecipes(filteredRecipes)
    }
    // this filters onCLick of Meal option
    const filteredRecipes = user.recipes.filter(recipe => {
      return recipe.meal_type === mealName
    })
    setMealRecipes(filteredRecipes)
  }

  const recipeMealsList = user.meals.map(meal => {
    return <li key={meal.id}
      onClick={() => { filterRecipesByMeal(meal.name) }}
    >{meal.name}</li>
  })

  useEffect(() => {

  }, [user])

  return (
    <>
      <h2>{user.username}'s Recipes by Meal</h2>
      <ol>{recipeMealsList}</ol>
      <div>
        <h3>
          {mealRecipes.length > 0 ? `${mealRecipes[0].meal_type} Recipes`
            : null}
        </h3>
        <ol>
          {mealRecipes.length > 0 ?
            mealRecipes.map(recipe => {
              return <li key={recipe.id}>
                <h4>{recipe.title}</h4>
                <p>{recipe.description}</p>
                <button onClick={() => handleUpdate(recipe.id)}>Update</button>
                <button onClick={() => handleDelete(recipe.id, recipe.meal_type)}>Delete</button>
              </li>
            })
            : null}
        </ol>
      </div>
    </>
  )
}

export default UserMealsList