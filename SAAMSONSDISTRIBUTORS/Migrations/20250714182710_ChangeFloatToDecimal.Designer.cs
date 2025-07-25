﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SAAMSONSDISTRIBUTORS.Models;

#nullable disable

namespace SAAMSONSDISTRIBUTORS.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250714182710_ChangeFloatToDecimal")]
    partial class ChangeFloatToDecimal
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("SAAMSONSDISTRIBUTORS.Models.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .HasColumnType("nvarchar(8)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(100)");

                    b.Property<int?>("Quantity")
                        .HasColumnType("int");

                    b.Property<decimal?>("SellingPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("SupplierName")
                        .HasColumnType("nvarchar(100)");

                    b.Property<decimal?>("UnitPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("Id");

                    b.ToTable("Products");
                });
#pragma warning restore 612, 618
        }
    }
}
