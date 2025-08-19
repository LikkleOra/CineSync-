import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, HeartFill } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { MovieCardProps } from "@/types"

export function MovieCard({ movie, onFavorite, isFavorite }: MovieCardProps) {
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite)

  const handleFavorite = () => {
    setLocalIsFavorite(!localIsFavorite)
    onFavorite()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{movie.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
          >
            {localIsFavorite ? (
              <HeartFill className="h-4 w-4 text-red-500" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="rounded-md object-cover"
            />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {movie.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-muted px-2 py-1 text-xs"
              >
                {genre}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
