#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["mobile-remote-server/mobile-remote-server.csproj", "mobile-remote-server/"]
RUN dotnet restore "mobile-remote-server/mobile-remote-server.csproj"
COPY . .
WORKDIR "/src/mobile-remote-server"
RUN dotnet build "mobile-remote-server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "mobile-remote-server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "mobile-remote-server.dll"]