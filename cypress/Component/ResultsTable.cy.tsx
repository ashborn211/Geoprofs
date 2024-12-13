import React from 'react'
import ResultsTable from '@/components/ResultsTable'

describe('<ResultsTable />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ResultsTable data={[]} />)
  })
})