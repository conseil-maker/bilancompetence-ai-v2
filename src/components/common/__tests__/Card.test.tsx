import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render title and description', () => {
    render(
      <Card title="Test Title" description="Test Description">
        <p>Content</p>
      </Card>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should render actions', () => {
    render(
      <Card
        title="Test"
        actions={<button>Action</button>}
      >
        <p>Content</p>
      </Card>
    )
    
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('should render footer', () => {
    render(
      <Card footer={<p>Footer content</p>}>
        <p>Content</p>
      </Card>
    )
    
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    
    render(
      <Card onClick={handleClick}>
        <p>Content</p>
      </Card>
    )
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be clickable with Enter key', () => {
    const handleClick = jest.fn()
    
    render(
      <Card onClick={handleClick}>
        <p>Content</p>
      </Card>
    )
    
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be clickable with Space key', () => {
    const handleClick = jest.fn()
    
    render(
      <Card onClick={handleClick}>
        <p>Content</p>
      </Card>
    )
    
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Content</p>
      </Card>
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should apply clickable styles when clickable prop is true', () => {
    const { container } = render(
      <Card clickable>
        <p>Content</p>
      </Card>
    )
    
    expect(container.firstChild).toHaveClass('cursor-pointer')
  })

  it('should not re-render with same props (memo)', () => {
    const renderSpy = jest.fn()
    
    function TestCard(props: any) {
      renderSpy()
      return <Card {...props} />
    }
    
    const { rerender } = render(
      <TestCard title="Test">
        <p>Content</p>
      </TestCard>
    )
    
    expect(renderSpy).toHaveBeenCalledTimes(1)
    
    // Rerender with same props
    rerender(
      <TestCard title="Test">
        <p>Content</p>
      </TestCard>
    )
    
    // Should still be called only once due to memo
    expect(renderSpy).toHaveBeenCalledTimes(1)
  })
})

