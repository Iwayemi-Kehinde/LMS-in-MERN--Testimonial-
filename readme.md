what can we use app.all() to do
do you think redis is really neccesary for my app


//unknown route
app.all("*", (req:Request, res:Response, next:NextFunction) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404))
})

app.all("*", (req:Request, res:Response, next:NextFunction) => {
  return next(new ErrorHandler(`${req.originalUrl} not found`, 500))
})

what is the difference ? 