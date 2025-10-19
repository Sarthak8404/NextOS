'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"

export default function BrowseToolsPage() {
  const [tools, setTools] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const placeholders = [
    "Search tools by name...",
    "Find tools by description...",
    "Search by capabilities...",
    "Discover powerful tools...",
    "What tool are you looking for?",
  ]

  useEffect(() => {
    fetchAllTools()
  }, [])

  const fetchAllTools = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/tools')
      const data = await response.json()
      if (data.success) {
        setTools(data.data)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    
    if (!searchQuery.trim()) {
      fetchAllTools()
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch('/api/tools/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 20 }),
      })
      const data = await response.json()
      if (data.success) {
        setTools(data.data)
      }
    } catch (error) {
      console.error('Error searching tools:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
    fetchAllTools()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Browse Tools</h1>
          <p className="text-slate-600 text-lg">Discover and search through our collection of powerful tools</p>
        </div>

        {/* Search Bar with Placeholders and Vanish */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleInputChange}
                onSubmit={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 text-slate-600 text-sm flex items-center justify-between">
          <div>
            {searchQuery ? (
              <p>Found <span className="font-semibold text-slate-900">{tools.length}</span> results for <span className="font-semibold text-slate-900">"{searchQuery}"</span></p>
            ) : (
              <p>Showing <span className="font-semibold text-slate-900">{tools.length}</span> tools</p>
            )}
          </div>
          {searchQuery && (
            <Button
              onClick={clearSearch}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear Search
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600">Loading tools...</p>
          </div>
        ) : tools.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-slate-50">
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 text-lg font-medium">No tools found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card key={tool._id} className="hover:shadow-md transition-shadow border-slate-200 cursor-pointer hover:border-blue-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {tool.name}
                    </CardTitle>
                    <Badge variant="secondary" className="whitespace-nowrap mt-1">
                      {tool.tool_type}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {tool.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tool.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Capabilities */}
                  {tool.capabilities && tool.capabilities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">Capabilities</p>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {tool.capabilities.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>v{tool.version}</span>
                    <span className="text-slate-600 font-medium">{tool.author?.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}