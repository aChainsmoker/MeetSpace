FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MeetSpace.Api/MeetSpace.Api.csproj", "MeetSpace.Api/"]
COPY ["MeetSpace.Domain/MeetSpace.Domain.csproj", "MeetSpace.Domain/"]
COPY ["MeetSpace.Infrastructure/MeetSpace.Infrastructure.csproj", "MeetSpace.Infrastructure/"]
COPY ["MeetSpace.Application/MeetSpace.Application.csproj", "MeetSpace.Application/"]
COPY ["MeetSpace.DataAccess/MeetSpace.DataAccess.csproj", "MeetSpace.DataAccess/"]
RUN dotnet restore "MeetSpace.Api/MeetSpace.Api.csproj"
COPY . .
WORKDIR "/src/MeetSpace.Api"
RUN dotnet build "MeetSpace.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MeetSpace.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MeetSpace.Api.dll"]
